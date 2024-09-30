import { todoList } from '../index.js';  // Importa correctamente la instancia de TodoList

// Función para crear el HTML de una tarea
export const crearTodoHtml = (todo) => {
    const htmlTodo = `
        <li class="${todo.completado ? 'completed' : ''}" data-id="${todo.id}">
            <div class="view">
                <input class="toggle" type="checkbox" ${todo.completado ? 'checked' : ''}>
                <label>${todo.tarea}</label>
                <button class="destroy"></button>
            </div>
        </li>
    `;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;
    document.querySelector('.todo-list').append(div.firstElementChild);
};

// Botones para los filtros y acciones
const btnTodos = document.querySelector('#filter-all');
const btnPendientes = document.querySelector('#filter-pending');
const btnCompletados = document.querySelector('#filter-completed');
const btnBorrarCompletados = document.querySelector('#clear-completed');

// Filtros de las tareas
btnTodos.addEventListener('click', () => {
    mostrarTodos();  // Muestra todas las tareas
});

btnPendientes.addEventListener('click', () => {
    mostrarPendientes();  // Muestra solo las tareas pendientes
});

btnCompletados.addEventListener('click', () => {
    mostrarCompletados();  // Muestra solo las tareas completadas
});

// Eliminar todas las tareas completadas
btnBorrarCompletados.addEventListener('click', () => {
    todoList.eliminarCompletados();  // Elimina las tareas completadas de la lista
    actualizarVista();  // Actualiza la vista
});

// Evento para eliminar tarea individual o marcar como completada
document.querySelector('.todo-list').addEventListener('click', (event) => {
    const elementoNombre = event.target.localName;  // 'input', 'button', etc.
    const todoElemento = event.target.parentElement.parentElement;  // El elemento 'li' que contiene la tarea
    const todoId = todoElemento.getAttribute('data-id');  // Obtiene el ID de la tarea

    // Eliminar tarea al hacer clic en el botón de eliminar
    if (elementoNombre === 'button') {
        todoList.eliminarTodo(todoId);  // Elimina la tarea de la lista
        todoElemento.remove();  // Elimina la tarea del DOM
    }

    // Marcar como completado
    if (elementoNombre === 'input') {
        todoList.marcarCompletado(todoId);  // Cambia el estado de completado
        todoElemento.classList.toggle('completed');  // Alterna la clase 'completed'
    }
});

// Evento para marcar todas las tareas como completadas o no completadas
document.querySelector('#toggle-all').addEventListener('click', (event) => {
    const completado = event.target.checked;  // Estado del checkbox (si está marcado o no)

    todoList.marcarTodasCompletadas(completado);  // Marca todas las tareas como completadas o no
    const todoElementos = document.querySelectorAll('.todo-list li');

    // Actualiza la clase 'completed' en el DOM para todas las tareas
    todoElementos.forEach(todoElemento => {
        if (completado) {
            todoElemento.classList.add('completed');
        } else {
            todoElemento.classList.remove('completed');
        }
    });
});

// Funciones de filtro
function mostrarTodos() {
    actualizarVista();
    todoList.todos.forEach(crearTodoHtml);  // Muestra todas las tareas
}

function mostrarPendientes() {
    actualizarVista();
    todoList.todos
        .filter(todo => !todo.completado)  // Filtrar solo las tareas pendientes
        .forEach(crearTodoHtml);
}

function mostrarCompletados() {
    actualizarVista();
    todoList.todos
        .filter(todo => todo.completado)  // Filtrar solo las tareas completadas
        .forEach(crearTodoHtml);
}

// Función para limpiar y actualizar el HTML de las tareas
function actualizarVista() {
    const divTodoList = document.querySelector('.todo-list');
    while (divTodoList.firstChild) {
        divTodoList.removeChild(divTodoList.firstChild);  // Elimina todos los elementos del DOM
    }
    todoList.todos.forEach(crearTodoHtml);  // Vuelve a renderizar las tareas actualizadas
}

// Evento para eliminar todas las tareas completadas
document.querySelector('#clear-completed').addEventListener('click', () => {
    todoList.eliminarCompletados();  // Elimina las tareas completadas de la lista
    const todoElementos = document.querySelectorAll('.todo-list li.completed');

    // Elimina del DOM las tareas que están completadas
    todoElementos.forEach(todoElemento => todoElemento.remove());
});
