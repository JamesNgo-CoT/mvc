// const counterController = new CounterController();

// document.body.appendChild(counterController.viewElement);

const model = createCounterModel();

const view = document.body.appendChild(createCounterView());

const controller = createCounterController(model, view);
