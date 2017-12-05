/* 
 * @Author: Frappé Gantt 
 * @Developer: Nooldey
 * @Developer-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-28 14:31:46 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-29 09:31:49
 * @Description: a package for gantt chart
 * @Arguments:
 * element: {
 *     required: true,
 *     type: querySelector String/HTML DOM/SVG DOM,
 *     description: svg container for draw chart
 * }
 * tasks: {
 *     required: true,
 *     format: {
 *         id,name,start,end,progress
 *     }
 * }
 * config: {
 *     required: no,
 *     description: configuration chart options
 * }
 */
import './gantt.scss';

import Bar from './Bar';
const moment = require('moment');
const Snap = require( "imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js" );

export default function Gantt(element, tasks, config) {
    const self = {};
    const support_mode = ['Day', 'Week', 'Month'];

/* ----INIT---- */

    function init() {
        /* initial options*/
        set_defaults();

        /* expose methods */
        self.change_view_mode = change_view_mode;
        self.unselect_all = unselect_all;
        self.view_is = view_is;
        self.get_bar = get_bar;
        self.trigger_event = trigger_event;
        self.refresh = refresh;

        /* initialize default view mode */
        change_view_mode(self.config.view_mode);
    }

    function set_defaults() {
        const defaults = {
            header_height: 50,
            column_width: 30,
            step: 24,
            view_modes: [...support_mode],
            view_mode: 'Day',
            bar: {
                height: 20
            },
            padding: 18,
            date_format: 'YYYY-MM-DD',
            custom_popup_html: null
        }
        self.config = Object.assign({}, defaults, config);
        reset_variables(tasks);
    }

    function reset_variables(tasks) {
        if (typeof element === 'string') {
            self.element = document.querySelector(element);
        } else if (element instanceof SVGElement) {
            self.element = element;
        } else if (element instanceof HTMLElement) {
            self.element = element.querySelector('svg')
        } else {
            /* cannot find element */
            throw new TypeError('Not supported type!')
        }

        self._tasks = tasks;
        self._bars = [];
        self.element_groups = {};
    }

    function refresh(updated_tasks) {
        reset_variables(updated_tasks);
        change_view_mode(self.config.view_mode);
    }

/* ----CHANGE VIEW MODE---- */

    function change_view_mode(mode) {
        if (support_mode.indexOf(mode)>-1) {
            set_scale(mode);
            prepare();
            render();
            trigger_event('view_change', [mode]);
        } else {
            throw new RangeError(`Error mode! Just support ${support_mode.join('、')}!`)
        }
    }

    function set_scale(mode) {
        self.config.view_mode = mode;
        switch (mode) {
            case 'Day':
                self.config.step = 24;
                self.config.column_width = 38;
                break;
            case 'Week':
                self.config.step = 24 * 7;
                self.config.column_width = 140;
                break;
            case 'Month':
                self.config.step = 24 * 30;
                self.config.column_width = 120;
                break;
            default:
                break;
        }
    }

/* Prepare */

    function prepare() {
        prepare_tasks();
        prepare_dates();
        prepare_canvas();
    }

    function prepare_tasks() {
        self.tasks = self._tasks.map((task,i) => {
            // momentify
            task._start = moment(task.start, self.config.date_format);
            task._end = moment(task.end, self.config.date_format);
            /* invalid task if duration too large */
            if (task._end.diff(task._start, 'years') > 10) {
                task._end = null
            }
            /* cache index */
            task._index = i;
            /* invalid dates */
            if (!task._start && !task._end) {
                task._start = moment().startOf('day');
                task._end = moment().startOf('day').add(2, 'days');
            }
            if (!task._start && task._end) {
                task._start = task._end.clone().add(-2, 'days');
            }
            if (task._start && !task._end) {
                task._end = task._start.clone().add(2, 'days')
            }
            /* invalid flag */
            if (!task.start || !task.end) {
                task.invalid = true;
            }

            /* uids */
            if (!task.id) {
                task.id = generate_id(task)
            }
            return task;
        })
    }

    function prepare_dates() {
        self.gantt_start = self.gantt_end = null;
        for(let task of self.tasks) {
            /* set global start and end date */
            if (!self.gantt_start || task._start < self.gantt_start) {
                self.gantt_start = task._start;
            }
            if (!self.gantt_end || task._end > self.gantt_end) {
                self.gantt_end = task._end;
            }
        }
        set_gantt_dates();
        setup_dates();
    }

    function prepare_canvas() {
        if (self.canvas) return;
        self.canvas = Snap(self.element).addClass('gantt');
    }
    
    function set_gantt_dates() {
        if (view_is('Month')) {
            self.gantt_start = self.gantt_start.clone().startOf('year');
            self.gantt_end = self.gantt_end.clone().endOf('month').add(1, 'year');
        } else {
            self.gantt_start = self.gantt_start.clone().startOf('month').subtract(1, 'month');
            self.gantt_end = self.gantt_end.clone().endOf('month').add(1,'month');
        }
    }

    function setup_dates() {
        self.dates = [];
        let cur_date = null;
        while(cur_date === null || cur_date < self.gantt_end) {
            if (!cur_date) {
                cur_date = self.gantt_start.clone();
            } else {
                cur_date = view_is('Month') ? 
                    cur_date.clone().add(1,'month') : 
                    cur_date.clone().add(self.config.step, 'hours');
            }
            self.dates.push(cur_date);
        }
    }

/* Render */

    function render() {
        clear();
        setup_groups();
        /* make layer views */
        make_grid();
        make_dates();
        make_bars();
        set_width();
        set_scroll_position();
        bind_grid_click();
    }

    function clear() {
        self.canvas.clear();
        self._bars = []
    }

    function setup_groups() {
        const groups = ['grid', 'date', 'progress', 'bar', 'details'];
        /* make group layers */
        for ( let group of groups ) {
            self.element_groups[group] = self.canvas.group().attr({'id': group})
        }
    }

/* Render--make_grid */

    function make_grid() {
        make_grid_background();
        make_grid_rows();
        make_grid_header();
        /* 栅格竖线 */
        make_grid_ticks();
        make_grid_highlights();
    }

    function make_grid_background() {
        const grid_width = self.dates.length * self.config.column_width,
            grid_height = self.config.header_height 
                        + self.config.padding 
                        + (self.config.bar.height + self.config.padding) * self.tasks.length;
        self.canvas.rect(0, 0, grid_width, grid_height)
                    .addClass('grid-background')
                    .appendTo(self.element_groups.grid);
        self.canvas.attr({
            height: grid_height + self.config.padding + 100,
            width: '100%'
        })
    }
    function make_grid_rows() {
        const rows = self.canvas.group().appendTo(self.element_groups.grid),
            lines = self.canvas.group().appendTo(self.element_groups.grid),
            row_width = self.dates.length * self.config.column_width,
            row_height = self.config.bar.height + self.config.padding;
        
        let row_y = self.config.header_height + self.config.padding / 2;

        for ( let task of self.tasks ) {
            self.canvas.rect(0, row_y, row_width, row_height)
                .addClass('grid-row')
                .appendTo(rows);
            self.canvas.line(0, row_y + row_height, row_width, row_y + row_height)
                .addClass('row-line')
                .appendTo(lines);
            row_y += row_height;
        }
    }
    function make_grid_header() {
        const header_height = self.config.header_height + 10,
            header_width = self.dates.length * self.config.column_width;
        self.canvas.rect(0, 0, header_width, header_height)
            .addClass('grid-header')
            .appendTo(self.element_groups.grid);
    }
    function make_grid_ticks() {
        let tick_x = 0,
            tick_y = self.config.header_height + self.config.padding / 2,
            tick_height = (self.config.bar.height + self.config.padding) * self.tasks.length;
        
        for(let date of self.dates) {
            let tick_class = 'tick';
            if (view_is('Day') && date.day() === 1) {
                tick_class += 'thick';
            }
            if (view_is('Week') && date.date() >= 1 && date.date() < 8) {
                tick_class += 'thick';
            }
            if (view_is('Month') && date.month() % 3 === 0) {
                tick_class += 'thick';
            }

            self.canvas.path(Snap.format('M {x} {y} v {height}', {
                x: tick_x,
                y: tick_y,
                height: tick_height
            }))
            .addClass(tick_class)
            .appendTo(self.element_groups.grid);

            if (view_is('Month')) {
                tick_x += date.daysInMonth() * self.config.column_width / 30;
            } else {
                tick_x += self.config.column_width;
            }
        }
    }
    function make_grid_highlights() {
        /* highlight today's date */
        if (view_is('Day')) {
            const x = moment().startOf('day').diff(self.gantt_start, 'hours') / self.config.step * self.config.column_width;
            const y = 0;
            const width = self.config.column_width;
            const height = (self.config.bar.height + self.config.padding) * self.tasks.length 
                    + self.config.header_height
                    + self.config.padding / 2;
            
            self.canvas.rect(x, y, width, height)
                .addClass('today-highlight')
                .appendTo(self.element_groups.grid);
        }
    }

/* Render--make_dates */

    function make_dates() {
        for(let date of get_dates_to_draw()) {
            self.canvas.text(date.lower_x, date.lower_y, date.lower_text)
                .addClass('lower-text')
                .appendTo(self.element_groups.date);
            
            if (date.upper_text) {
                const $upper_text = self.canvas.text(date.upper_x, date.upper_y, date.upper_text)
                    .addClass('upper-text')
                    .appendTo(self.element_groups.date);
                
                if ($upper_text.getBBox().x2 > self.element_groups.grid.getBBox().width) {
                    /* NOTE: 移除超出grid边界的日期 */
                    /* 参考资料： http://snapsvg.io/docs/#Element.getBBox*/
                    $upper_text.remove();
                }
            }
        }
    }

    function get_dates_to_draw() {
        let last_date = null;
        const dates = self.dates.map((date, i) => {
            const d = get_date_info(date, last_date, i);
            last_date = date;
            return d;
        })
        return dates;
    }
    function get_date_info(date, last_date, i) {
        if (!last_date) {
            last_date = date.clone().add(1, 'year');
        }
        const cw = self.config.column_width;
        const date_text = {
            'Day_lower': date.date() !== last_date.date() ? date.format('D') : '',
            'Week_lower': date.month() !== last_date.month() ? date.format('D MMM') : date.format('D'),
            'Month_lower': date.format('MMMM'),
            'Day_upper': date.month() !== last_date.month() ? date.format('MMMM') : '',
            'Week_upper': date.month() !== last_date.month() ? date.format('MMMM') : '',
            'Month_upper': date.year() !== last_date.year() ? date.format('YYYY') : ''
        };
        const base_pos = {
            x: i * cw,
            lower_y: self.config.header_height,
            upper_y: self.config.header_height - 25
        };
        const x_pos = {
            'Day_lower': cw / 2,
            'Day_upper': (cw * 30) / 2,
            'Week_lower': 0,
            'Week_upper': (cw * 4) / 2,
            'Month_lower': cw / 2,
            'Month_upper': (cw * 12) / 2
        };
        return {
            upper_text: date_text[`${self.config.view_mode}_upper`],
            lower_text: date_text[`${self.config.view_mode}_lower`],
            upper_x: base_pos.x + x_pos[`${self.config.view_mode}_upper`],
            upper_y: base_pos.upper_y,
            lower_x: base_pos.x + x_pos[`${self.config.view_mode}_lower`],
            lower_y: base_pos.lower_y
        }
    }

/* Render--make_bars */

    function make_bars() {
        self._bars = self.tasks.map(task => {
            const bar = Bar(self, task);
            self.element_groups.bar.add(bar.group)
            return bar;
        })
    }

/* Render--others */

    function set_width() {
        const cur_width = self.canvas.node.getBoundingClientRect().width;
        const actual_width = self.canvas.select('#grid .grid-row').attr('width');
        if (cur_width < actual_width) {
            self.canvas.attr('width', actual_width);
        }
    }

    function set_scroll_position() {
        const parent_element = self.element.parentElement;
        if (!parent_element) return;
        const scroll_pos = get_min_date().diff(self.gantt_start, 'hours') / self.config.step * self.config.column_width - self.config.column_width;

        parent_element.scrollLeft = scroll_pos;
    }

    function get_min_date() {
        const task = self.tasks.reduce((acc, curr) => {
            return curr._start.isSameOrBefore(acc._start) ? curr : acc;
        })
        return task._start;
    }

    function bind_grid_click() {
        self.element_groups.grid.click(() => {
            unselect_all();
            self.element_groups.details.selectAll('.details-wrapper').forEach(el => el.addClass('hide'));
        })
    }

/* Tool Methods */
    function unselect_all() {
        self.canvas.selectAll('.bar-wrapper').forEach(el => {
            el.removeClass('active');
        });
    }

    function view_is(modes) {
        if (typeof modes === 'string') {
            return self.config.view_mode === modes;
        } else if (Array.isArray(modes)) {
            return modes.some(mode => mode === self.config.view_mode)
        }
    }

    function generate_id(task) {
        return task.name + '_' + Math.random().toString(36).slice(2,12);
    }
/* 待定 */
    function get_task(id) {
		return self.tasks.find((task) => {
			return task.id === id;
		});
	}

	function get_bar(id) {
		return self._bars.find((bar) => {
			return bar.task.id === id;
		});
    }
    
    function trigger_event(event, args) {
		if(self.config['on_' + event]) {
			self.config['on_' + event].apply(null, args);
		}
	}

/* Output */
    init();
    return self;
}