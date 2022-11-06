(function () {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    
    function getItemsByKeyString(allItems, key) {
        return JSON.stringify(allItems.filter(item => item.key === key));
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');
        
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.setAttribute('disabled', 'true');
        
        input.addEventListener('input', function () {
            if (!input.value){
                button.setAttribute('disabled', 'true');
            }
            else {
                button.removeAttribute('disabled', 'false');
            }
        })
        
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        return {form, input, button};
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }
    
    function createTodoItem(item_obj) {
        let item = document.createElement('li');
        
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = item_obj.name;
        buttonGroup.classList.add('btn-group', 'gtn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
        if (item_obj.done) {
            item.classList.toggle('list-group-item-success');
        }
    
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            item_obj.done = !item_obj.done;
            localStorage.setItem('all', JSON.stringify(window.allItems));
            localStorage.setItem(item_obj.key, getItemsByKeyString(window.allItems, item_obj.key));
        })
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                allItems.splice(allItems.indexOf(item_obj), 1);
                item.remove();
                localStorage.setItem('all', JSON.stringify(allItems));
                localStorage.setItem(item_obj.key, getItemsByKeyString(allItems, item_obj.key));
            }
        });
        
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        return {item, doneButton, deleteButton};
    }
    
    function createTodoApp(container, key, title = 'Список дел', items = []) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        if (localStorage.getItem('all')){
            window.allItems = JSON.parse(localStorage.getItem('all'));
        }
        else{
            window.allItems = []
        }
        localStorage.setItem('all', JSON.stringify(window.allItems));
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        if (window.allItems)
            window.allItems.filter(elem => elem.key === key).forEach(elem => todoList.append(createTodoItem(elem).item));
        items.forEach(elem => todoList.append(createTodoItem(elem).item), key);
        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }
            window.allItems = JSON.parse(localStorage.getItem('all'));
            let item = {name: todoItemForm.input.value, done: false, key: key};
            let todoItem = createTodoItem(item);
            todoItemForm.button.setAttribute('disabled', 'true');
            window.allItems = JSON.parse(localStorage.getItem('all'));
            window.allItems.push(item);
            localStorage.setItem('all', JSON.stringify(allItems));
            localStorage.setItem(key, getItemsByKeyString(allItems, key));
            todoList.append(todoItem.item);
            
            todoItemForm.input.value = '';
        })
    }
    window.createTodoApp = createTodoApp;
})();
