 /* 
 * @Author: Frappé Gantt 
 * @Developer: Nooldey
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-29 09:32:21 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-11-29 10:11:05
 * @Description: gantt chart bars
 * @arguments:
 *      - gt: Gantt object
 *      - task: task object
 *       
 */

export default function Bar(gt, task) {
    const self = {};

    function init() {
        set_defaults();
        prepare();
        draw();
        bind();
    }
    
    function set_defaults() {
        self.action_completed = false;
        self.task = task;
    }

    /* ----Prepare---- */
    function prepare() {
        prepare_values();
        prepare_plugins();
    }

    function prepare_values() {
        self.invalid = self.task.invalid;
        self.height = gt.config.bar.height;
        self.x = compute_x();
        self.y = compute_y();
        self.corner_radius = 3;
        self.duration = (self.task._end.diff(self.task._start,'hours')+24) / gt.config.step;
        self.width = gt.config.column_width * self.duration;
        self.progress_width = gt.config.column_width * self.duration * (self.task.progress/100) || 0;
        self.group = gt.canvas.group().addClass('bar-wrapper').addClass(self.task.custom_class || '');
        self.bar_group = gt.canvas.group().addClass('bar-group').appendTo(self.group);
    }

    function compute_x() {
        let x = self.task._start.diff(gt.gantt_start, 'hours') /
                gt.config.step * gt.config.column_width;

        if (gt.view_is('Month')) {
            x = self.task._start.diff(gt.gantt_start, 'days') *
                gt.config.column_width / 30;
        }
        return x;
    }
    function compute_y() {
        return gt.config.header_height + gt.config.padding + self.task._index * (self.height + gt.config.padding);
    }

    function prepare_plugins() {
        Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
			Element.prototype.getX = function () {
				return +this.attr('x');
			};
			Element.prototype.getY = function () {
				return +this.attr('y');
			};
			Element.prototype.getWidth = function () {
				return +this.attr('width');
			};
			Element.prototype.getHeight = function () {
				return +this.attr('height');
			};
			Element.prototype.getEndX = function () {
				return this.getX() + this.getWidth();
			};
		});
    }

    /* ----Draw---- */
    function draw() {
        draw_bar();
        draw_progress_bar();
        draw_label();
    }

    function draw_bar() {
        self.$bar = gt.canvas
            .rect(self.x, self.y, self.width, self.height, self.corner_radius, self.corner_radius)
            .addClass('bar')
            .appendTo(self.bar_group);
        if (self.invalid) {
            self.$bar.addClass('bar-invalid')
        }
    }
    function draw_progress_bar() {
        if (self.invalid) return;
        self.$bar_progress = gt.canvas
            .rect(self.x, self.y, self.progress_width, self.height, self.corner_radius, self.corner_radius)
            .addClass('bar-progress')
            .appendTo(self.bar_group);
    }
    function draw_label() {
        gt.canvas.text(self.x + self.width / 2, self.y + self.height / 2, self.task.name).addClass('bar-label').appendTo(self.bar_group);
        update_label_position();
    }
    
    function update_label_position() {
        const bar = self.$bar,
            label = self.group.select('.bar-label');
        if (label.getBBox().width > bar.getWidth()) {
            label.addClass('big').attr('x', bar.getX() + bar.getWidth() + 5);
        } else {
            label.removeClass('big').attr('x', bar.getX() + bar.getWidth() / 2);
        }
    }

    /* TODO: 暂时做到这里。。。 */

    /* ----Bind---- */
    function bind() {
        if (self.invalid) return;
        setup_click_event();
        show_details();
    }


/* ACTIVE */
    init();
    return self;
}
    