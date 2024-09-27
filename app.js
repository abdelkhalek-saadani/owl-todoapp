const { Component, mount, xml } = owl;

// Owl Components
class Root extends Component {

  

  static template = xml/* xml */ `
      <div class="task-list" >
          <t t-foreach="tasks" t-as="task" t-key="task.id">
              <div class="task" t-att-class="task.isCompleted ? 'done' : ''">
                  <span><t t-esc="task_index+1"/></span>
                  <input type="checkbox" t-att-checked="task.isCompleted"/>
                  <span><t t-esc="task.text"/></span>
              </div>
          </t>
      </div>`;

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

mount(Root, document.body);
