const { Component, mount, xml } = owl;

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
      <div class="task-list" >
          <t t-foreach="tasks" t-as="task" t-key="task.id">
              <Task task="task" task_index="task_index" />
          </t>
      </div>`;
  static components = { Task };
  tasks = [
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
  ];
}

mount(Root, document.body, { dev: true });
