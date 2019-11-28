import React, { Component } from 'react';

class TodoItem extends Component {
  constructor(props){
    super(props)
  }
  handleBind() {
  }
  render() {
    const {
      idx,
      updateTodoName,
      handleContentEditableKeyPress,
      todo,
      handleCheckboxClick,
      handleDeleteButtonClick,
      handleCreateList,
      handleFaviourteItem,
      timeago
    } = this.props;

    return(
        <li
          key={idx}
          className="Todo__List__item"
        >
          <p
            className="Todo__List__item__name"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={updateTodoName}
            onKeyPress={handleContentEditableKeyPress}
            key={idx}
            data-key={idx}
          >
            {todo.name}
          </p>
          <p className={`${todo.done?'Todo__List__item__done' : 'Todo__List__item__created'}`}>
            {`${
                todo.done?
                'Done @ '+timeago(todo.updated):
                'Created @ '+timeago(todo.created)
            }`}
          </p>
          <input
            className="Todo__List__item__cb"
            type="checkbox"
            checked={todo.done}
            onChange={handleCheckboxClick}
            data-key={idx}
          />
          <span className="Todo__List__item__cbCover"></span>
          {<button
            className="Todo__List__item__FavButton"
            title={`Pin item on top`}
            data-key={idx}
            onClick={handleFaviourteItem}
          >
          <i className="mi">{`${todo.isFavourite?'flag':'outlined_flag'}`}</i>
          </button>}
          {!todo.done&&<button
            className="Todo__List__Item__Button green"
            title={`add sub-list for ${todo.name}`}
            data-key={idx}
            onClick={handleCreateList}
          >
          <i className="mi">playlist_add</i>
          </button>}
          <button
            className={`Todo__List__Item__Button ${todo.done?'':'red'}`}
            title={`delete ${todo.name}`}
            data-key={idx}
            onClick={handleDeleteButtonClick}
          >
          <i className="mi">delete</i>
          </button>
        </li>
    );
  }
}
export default TodoItem;