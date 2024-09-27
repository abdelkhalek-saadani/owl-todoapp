const { Component, mount, xml, useState} = owl;

// -------------------------------------------------------------------------
// Task Component
// -------------------------------------------------------------------------
class Task extends Component {
  static template = xml/* xml */ `
      <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <span><t t-esc="props.task_index+1"/></span>
        <input type="checkbox" t-att-checked="props.task.isCompleted"/>
        <span><t t-esc="props.task.text"/></span>
      </div>`;

  static props = ["task","task_index"];
}

// -------------------------------------------------------------------------
// Root Component
// -------------------------------------------------------------------------
class Root extends Component {
  static template = xml/* xml */ `
    <div class="todo-app">
      <input placeholder="Add Task" t-on-keyup="addTask" />
      <div class="task-list" >
          <t t-foreach="tasks" t-as="task" t-key="task.id">
              <Task task="task" task_index="task_index" />
          </t>
      </div>
    </div>`;
  static components = { Task };

  addTask(ev) {
    if (ev.keyCode === 13) {
      const text = ev.target.value.trim();
      console.log("text entered ",text);
      ev.target.value = "";
      this.tasks.push({
        id: this.tasks.length + 1,
        text: text,
        isCompleted: false,
      });
    }
  }
  tasks = useState([
    {
      id: 1,
      text: "buy milk",
      isCompleted: true,
    },
    {
      id: 2,
      text: "clean house",
      isCompleted: false,
    },
  ]);
}

mount(Root, document.body, { dev: true });
