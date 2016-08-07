Todos.TodosController = Ember.ArrayController.extend({
	actions: {
		createTodo: function () {
			// Get the todo title set by the "New Todo" text field
			var title = this.get('newTitle');
			if (!title.trim()) { return; }

			// Create the new Todo model
			var todo = this.store.createRecord('todo', {
				title: title,
				isCompleted: false
			});

			// Clear the "New Todo" text field
			this.set('newTitle', '');

			// Save the new model
			todo.save();
		},
		clearCompleted: function () {
			var completed = this.filterProperty('isCompleted', true);
			completed.invoke('deleteRecord');
			completed.invoke('save');
		}
	},
	allAreDone: function (key, value) {
		if (value === undefined) {
			return !!this.get('length') && this.everyProperty('isCompleted', true);
		} else {
			this.setEach('isCompleted', value);
			this.invoke('save');
			return value;
		}
	}.property('@each.isCompleted'),
	hasCompleted: function () {
		return this.get('completed') > 0;
	}.property('completed'),
	remaining: function () {
		return this.filterProperty('isCompleted', false).get('length');
	}.property('@each.isCompleted'),

	completed: function () {
		return this.filterProperty('isCompleted', true).get('length');
	}.property('@each.isCompleted'),

	inflection: function () {
		var remaining = this.get('remaining');
		return remaining === 1 ? 'item' : 'items';
	}.property('remaining')
});

// handle single todo
Todos.TodoController = Ember.ObjectController.extend({
	isCompleted: function(key, value){
		var model = this.get('model');

		if (value === undefined) {
			// property being used as a getter
			return model.get('isCompleted');
		} else {
			// property being used as a setter
			model.set('isCompleted', value);
			model.save();
			return value;
		}
	}.property('model.isCompleted'),
	actions: {
		editTodo: function () {
			this.set('isEditing', true);
		},
		acceptChanges: function () {
			this.set('isEditing', false);
			this.get('model').save();
		},
		removeTodo: function () {
			var todo = this.get('model');
			todo.deleteRecord();
			todo.save();
		}
	},
	isEditing: false,
});