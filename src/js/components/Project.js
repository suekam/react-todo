import React, { Component } from 'react';
import TodoList from './TodoList.js';

class Project extends Component {
	constructor(props){
		super(props)
    this.state = {
    	projectName: 'My Project 1',
    	lists: {
    		0:{name:'My List 1'}
    	},
    }
    this.handleBind();
	}
	handleBind() {
		this.addTodoList = this.addTodoList.bind(this)
		this.updateListName = this.updateListName.bind(this)
		this.deleteTodoList = this.deleteTodoList.bind(this)
		this.handleAddTodoList = this.handleAddTodoList.bind(this)
	}
	render() {
		// const {lists,subListsMap} = this.state;
		const {lists} = this.state;
		const keys = Object.keys(lists);
		let listElements = (keys).map(function(i){
			i = Number(i);
			return (
				<TodoList
					idx={i}
					listName={lists[i].name}
					updateListName={this.updateListName}
					deleteTodoList={this.deleteTodoList}
					addTodoList={this.addTodoList}
					isHideDelete={keys.length==1}
					// subListsMap={subListsMap&&subListsMap[i]}
				/>
			);
		},this)
		return	(
	  	<div className="Todo__Page">
	  		<div className="Todo__Scroller">
					{listElements}
	  		</div>
	  		<button
	  			className="Todo__AddListButton mi"
          onClick={this.handleAddTodoList}
	  		>
	  			add
	  		</button>
	  	</div>
		)
	}
	handleAddTodoList(event){
		this.addTodoList();
	}
	addTodoList(linkedItemId, listName, originalListIdx) {
		const {lists} = this.state;
		let{subListsMap} = this.state;
		const arr = Object.keys(lists).map(function(i){return Number(i)})
		const max = arr.reduce(function(a, b) {
		    return Math.max(a, b);
		});
		const newListId = max+1;
		const isCreatingSubList = linkedItemId!==null;
		// if(isCreatingSubList){
		// 	if(subListsMap&&subListsMap[originalListIdx]&&subListsMap[originalListIdx][linkedItemId]){
		// 		return;
		// 	}
		// }

		this.setState({
			lists: Object.assign(lists,{
				[newListId]:{
					name: listName||`My List ${max+2}`,
					linkedItemId: linkedItemId,
					isSubList: isCreatingSubList
				}
			})
		})

		// if(isCreatingSubList){
		// 	if(!subListsMap){
		// 		subListsMap = {};
		// 	}
		// 	if(!subListsMap[originalListIdx]){
		// 		subListsMap[originalListIdx] = {};
		// 	}
		// 	subListsMap[originalListIdx][linkedItemId] = newListId;
		// 	this.setState(Object.assign(this.state.subListsMap, subListsMap));
		// }

	}
	updateListName(idx, name) {
		const {lists} = this.state;
		this.setState({
			lists: Object.assign(lists,{
				[idx]:{name: name}
			})
		})
	}
	deleteTodoList(idx) {
		const {lists} = this.state;
		let updatedLists = Object.assign(lists, {});
		delete updatedLists[idx];
		this.setState({
			lists: updatedLists
		})
	}
}

export default Project;
