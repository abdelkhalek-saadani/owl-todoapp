const { Component, mount, xml, useState, useRef, onMounted, reactive, useEnv } =
  owl;

// -------------------------------------------------------------------------
// Store
// -------------------------------------------------------------------------

function useStore() {
  const env = useEnv();
  return useState(env.store);
}

// -------------------------------------------------------------------------
// TaskList
// -------------------------------------------------------------------------
class TaskList {
  constructor(tasks) {
    this.tasks = tasks || [];
    const taskIds = this.tasks.map((t) => t.id);
    this.nextId = taskIds.length ? Math.max(...taskIds) + 1 : 1;
  }

  addTask(text) {
    text = text.trim();
    if (text) {
      const newTask = {
        id: this.nextId++,
        text: text,
        isCompleted: false,
      };
      this.tasks.push(newTask);
    }
  }

  toggleTask(task) {
    task.isCompleted = !task.isCompleted;
  }

  deleteTask(task) {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
  }
}

function createTaskStore() {
  const saveTasks = () =>
    localStorage.setItem("todoapp", JSON.stringify(taskStore.tasks));
  const initialTasks = JSON.parse(localStorage.getItem("todoapp") || "[]");
  const taskStore = reactive(new TaskList(initialTasks), saveTasks);
  saveTasks();
  return taskStore;
}
// -------------------------------------------------------------------------
// Task Component
// -------------------------------------------------------------------------
class Task extends Component {
  static template = xml/* xml */ `
      <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <span><t t-esc="props.task_index+1"/></span>
        <input type="checkbox" t-att-checked="props.task.isCompleted"
          t-att-id="props.task.id"
          t-on-click="() => store.toggleTask(props.task)"/>
        <label t-att-for="props.task.id"><t t-esc="props.task.text"/></label>
        <span class="delete" t-on-click="() => store.deleteTask(props.task)">🗑</span>
      </div>`;

  static props = ["task", "task_index"];

  setup() {
    this.store = useStore();
  }
}

// -------------------------------------------------------------------------
// Root Component
// -------------------------------------------------------------------------
class Root extends Component {
  static template = xml/* xml */ `
    <div class="todo-app">
      <input placeholder="Add Task" t-on-keyup="addTask" t-ref="add-input" />
      <div class="task-list" >
          <t t-foreach="displayedTasks" t-as="task" t-key="task.id">
              <Task task="task" task_index="task_index"/>
          </t>
      </div>
      <div class="task-panel">
          <div class="task-counter">
            <t t-if="displayedTasks.length != store.tasks.length" >
              <t t-esc="displayedTasks.length"/> / <t t-esc="store.tasks.length"/> tasks
            </t> 
          </div>
          <div>
            <span 
              t-foreach="['all', 'active', 'completed']" 
              t-as="filter" 
              t-key="filter" 
              t-att-class="{active: this.filter.value===filter}"
              t-esc="filter"
              t-on-click="() => this.setFilter(filter)"/>
          </div> 
      </div>
    </div>
    `;
  static components = { Task };

  setup() {
    const inputRef = useRef("add-input");
    onMounted(() => inputRef.el.focus());
    this.store = useStore();
    this.filter = useState({ value: "all" });
  }

  addTask(ev) {
    if (ev.keyCode === 13) {
      const text = ev.target.value.trim();
      this.store.addTask(text);
      ev.target.value = "";
    }
  }

  get displayedTasks() {
    const tasks = this.store.tasks;
    switch (this.filter.value) {
      case "active":
        return tasks.filter((t) => !t.isCompleted);
      case "completed":
        return tasks.filter((t) => t.isCompleted);
      case "all":
        return tasks;
    }
  }

  setFilter(filter) {
    this.filter.value = filter;
  }
}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------
const env = {
  store: createTaskStore(),
};

mount(Root, document.body, { dev: true, env });
