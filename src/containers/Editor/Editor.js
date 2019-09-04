import React, { Component } from 'react'
import { observer } from 'mobx-react'
import classes from './Editor.module.css'
import Tree from '../../components/Tree/Tree'
import db from '../../db'
import cache from '../../cache'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrash, faEdit, faPlus, faRedo } from '@fortawesome/free-solid-svg-icons'

class Editor extends Component {
    constructor() {
        super()
        this.state = {
            selectedToLoad: null,
            selectedToEdit: null,
            isEditing: false,
            tempId: -1,
        }
    }
    selectToLoad = id => {
        const { selectedToLoad } = this.state
        if (selectedToLoad === id) {
            id = null
        }
        this.setState({ selectedToLoad: id })
    }
    selectToEdit = id => {
        const { selectedToEdit } = this.state
        if (selectedToEdit === id) {
            id = null
        }
        this.setState({ selectedToEdit: id })
    }
    loadToCache = () => {
        const { loadParents } = this.state
        cache.loadItem(this.state.selectedToLoad, db, loadParents)
    }
    startEdit = () => {
        this.setState({ isEditing: true })
    }
    stopEdit = () => {
        const { selectedToEdit } = this.state
        let editingItem = cache.items.find(_item => _item.id === selectedToEdit)
        let deleted = false
        if (editingItem && editingItem.adding) {
            deleted = cache.deleteItem(selectedToEdit)
        }
        let newSelectedToEdit = deleted ? editingItem.parent : selectedToEdit
        this.setState({ isEditing: false, selectedToEdit: newSelectedToEdit })
    }
    setNewValue = value => {
        cache.changeItem(this.state.selectedToEdit, value)
        this.stopEdit()
    }
    addNewItem = () => {
        const { selectedToEdit, tempId } = this.state
        cache.addItem(tempId, 'New Node', selectedToEdit)
        this.setState({ selectedToEdit: tempId, tempId: tempId - 1, isEditing: true })
    }
    removeItem = () => {
        let deleted = cache.deleteItem(this.state.selectedToEdit)
        if (deleted) {
            this.setState({ selectedToEdit: null })
        }
    }
    save = () => {
        cache.saveItems(db)
        this.setState({ selectedToLoad: null })
    }
    reset = () => {
        cache.reset(db)
        this.setState({ selectedToEdit: null, selectedToLoad: null, isEditing: false, tempId: -1 })
    }
    render() {
        const { selectedToLoad, selectedToEdit, isEditing } = this.state
        return (
            <div className={classes.App}>
                <div className={classes.Wrapper}>
                    <Tree
                        items={cache.items}
                        selected={selectedToEdit}
                        onSelect={this.selectToEdit}
                        isEditing={isEditing}
                        setNewValue={this.setNewValue}
                        stopEdit={this.stopEdit}
                    />
                    <div className={classes.LoadButtonWrapper}>
                        <button onClick={this.loadToCache}>&lt;&lt;&lt;</button>
                    </div>
                    <Tree items={db.items} dbInstance selected={selectedToLoad} onSelect={this.selectToLoad} />
                </div>
                <div className={classes.ControlsWrapper}>
                    <button disabled={!selectedToEdit || isEditing} onClick={this.addNewItem}>
                        <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button disabled={!selectedToEdit || isEditing} onClick={this.removeItem}>
                        <FontAwesomeIcon icon={faTrash} /> Remove
                    </button>
                    <button disabled={!selectedToEdit || isEditing} onClick={this.startEdit}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button disabled={isEditing} onClick={this.save}>
                        <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                    <button onClick={this.reset}>
                        <FontAwesomeIcon icon={faRedo} /> Reset
                    </button>
                </div>
            </div>
        )
    }
}

export default observer(Editor)
