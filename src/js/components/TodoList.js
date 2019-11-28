import React, { Component } from 'react';
import timeago from 'timeago.js';
import TodoItem from './TodoItem.js';

class TodoList extends Component {
  constructor(props){
    super(props)
    this.state = {
      inputValue: '',
      todos: {
      },
      secondsElapsed: 0,
      listInitializedTime: null
    }
    this.handleBind();
  }

  tick() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 50});
  }

  componentDidMount() {
    this.setState({listInitializedTime: new Date()})
    this.interval = setInterval(this.tick, 50000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleBind() {
    this.tick = this.tick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleAddListItem = this.handleAddListItem.bind(this)
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateTodoName = this.updateTodoName.bind(this)
    this.updateListName = this.updateListName.bind(this)
    this.handleContentEditableKeyPress = this.handleContentEditableKeyPress.bind(this);
    this.handleCreateList = this.handleCreateList.bind(this);
    this.handleFaviourteItem = this.handleFaviourteItem.bind(this);
    this.handleDeleteTodoList = this.handleDeleteTodoList.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.listName !== this.state.listName) {
      this.setState({listName:this.state.listName});
    }
    // if (prevState.subListsMap !== this.state.subListsMap) {
    //   this.setState({subListsMap:this.state.subListsMap});
    // }
    if (prevState.idx !== this.state.idx) {
      this.setState({idx:this.state.idx});
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.listName!==prevState.listName){
      return {listName : nextProps.listName};
    }
    // if(nextProps.subListsMap!==prevState.subListsMap){
    //   return {subListsMap : nextProps.subListsMap};
    // }
    if(nextProps.idx!==prevState.idx){
      return {idx : nextProps.idx};
    }
    return null;
  }

  render() {
    const {
      inputValue
    } = this.state;
    // const {
    //   subListsMap
    // } = this.props;
    let done = 0;

    const todos = this.sortTodoList().map(function(t){
      const idx = t.idx;
      const todo = t.item;
      if(todo.done) done+=1;
      return(<TodoItem
        idx={`${idx}`}
        todo={todo}
        updateTodoName={this.updateTodoName}
        handleContentEditableKeyPress={this.handleContentEditableKeyPress}
        handleCheckboxClick={this.handleCheckboxClick}
        handleDeleteButtonClick={this.handleDeleteButtonClick}
        handleCreateList={this.handleCreateList}
        handleFaviourteItem={this.handleFaviourteItem}
        timeago={this.timeago}
     />);
    },this)||'';

    const todosCount = Object.keys(todos).length;

    return(
      <div className="Todo__Container">
        <p key="created" className="Todo__Created">
          <span>
            <span
              className="Todo__ListName"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={this.updateListName}
              onKeyPress={this.handleContentEditableKeyPress}
            >
              {this.props.listName}
            </span>
            {
              ' ('+done+'/'+todosCount+') '
            }
          </span>
        </p>
        <div key="box" className="Todo__Box">
          <div className="Todo__InputWrapper">
            <input
              className="Todo__InputWrapper__input"
              type="text"
              value={inputValue}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
            />
            <button
              className="Todo__InputWrapper__button"
              onClick={this.handleAddListItem}
            >
            <i className="mi">add_circle</i>
            </button>
          </div>
          <ul key="list" className="Todo__List">
            {todos}
          </ul>
        </div>

        {this.props.isHideDelete?null:
          <button
            className="Todo__ListDeteleButton mi"
            data-list={this.props.idx}
            onClick={this.handleDeleteTodoList}
          >
            delete
          </button>
        }
      </div>
    );
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value,
    })
  }

  handleAddListItem(event) {
    const {todos,inputValue} = this.state;
    if(inputValue === '') return;
    const time = (new Date()).getTime();
    const todosCount = Object.keys(todos).length;
    let newState = { inputValue: '' };
    newState.todos = Object.assign(todos,{
      [todosCount]: {
        name: inputValue,
        created: time,
        done: false,
        updated: null,
        isFavourite: false,
      }
    })

    this.setState(newState)
  }

  handleCheckboxClick(event){
    const {todos} = this.state;
    const key = Number(event.target.getAttribute('data-key'));
    let selected = todos[key];
    // debugger;
    this.setState({
      todos : Object.assign(todos,{
        [key]: Object.assign(selected, {
          done: !selected.done,
          updated: (new Date()).getTime(),
        })
      }),
      inputValue: '',
    })

  }

  handleDeleteButtonClick(event){
    const key = Number(event.target.getAttribute('data-key'));
    let todos = this.state.todos;
    delete todos[key];
    this.setState({
      todos: todos,
      inputValue: '',
    })
  }

  handleDeleteTodoList(event){
    if(!window.confirm('Are you sure to delete this checklist?')) return;
    const list = Number(event.target.getAttribute('data-list'));
    this.props.deleteTodoList(list);
  }

  updateTodoName(event){
    const {todos} = this.state;
    const key = Number(event.target.getAttribute('data-key'));
    let selected = todos[key];

    this.setState({
      todos : Object.assign(todos,{
        [key]: Object.assign(selected, {
          name: event.target.innerText||'Untitled'
        })
      }),
      inputValue: '',
    })

  }

  handleCreateList(event){
    const {todos} = this.state;
    const {listName} = this.props;
    const key = Number(event.target.getAttribute('data-key'));
    let selected = todos[key];
    this.setState({
      todos : Object.assign(todos,{
        [key]: Object.assign(selected, {
          isAddedSublist: true
        })
      })
    })
    this.props.addTodoList(key, `[${listName}] - ${selected.name}`, this.props.idx)
  }

  handleFaviourteItem(event){
    const {todos} = this.state;
    const key = Number(event.target.getAttribute('data-key'));
    let selected = todos[key];

    this.setState({
      todos : Object.assign(todos,{
        [key]: Object.assign(selected, {
          isFavourite: !selected.isFavourite
        })
      }),
      inputValue: '',
    })
  }

  updateListName(event){
    const updatedName = event.target.innerText||'Untitled';
    this.props.updateListName(this.props.idx, updatedName)
  }

  handleKeyPress(event){
    if (event.key === 'Enter') {
      this.handleAddListItem(event)
    }
  }

  handleContentEditableKeyPress(event){
    if (event.key === 'Enter') {
      event.preventDefault();
      switch(event.target.className){
        case "Todo__List__item__name":
        this.updateTodoName(event);
        break;
        case "Todo__ListName":
        this.updateListName(event);
        break;
        default:
        break;
      }
    }
  }

  sortTodoList(){
    const { todos } = this.state;
    let todosKeys = Object.keys(todos);
    return todosKeys.map(function(t){
      return {idx: t, item: todos[t]};
    }).sort(function(a,b){
      var aUpdated = a.item.updated || a.item.created;
      var bUpdated = b.item.updated || b.item.created;
      var aFav = a.item.isFavourite;
      var bFav = b.item.isFavourite;
      var aDone = a.item.done;
      var bDone = b.item.done;

      // equal items sort equally
      if (a === b) {
          return 0;
      }
      // nulls sort before anything else
      else if (aFav) {
          return -1;
      }
      else if (bFav) {
          return 1;
      }
      // dones sort after anything else
      else if (aDone) {
          return 1;
      }
      else if (bDone) {
          return -1;
      }
      // otherwise, if descending, highest sorts first
      else {
          return aUpdated < bUpdated ?  1 : -1;
      }

    });

  }

  timeago(timestamp){
    return timeago().format(timestamp);
  }

}

export default TodoList;
