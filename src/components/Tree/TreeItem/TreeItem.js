import React, { Component, Fragment } from 'react'
import classes from './TreeItem.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf } from '@fortawesome/free-solid-svg-icons'

class TreeItem extends Component {
    constructor(props) {
        super()
        this.state = {
            newValue: props.item.value,
        }
    }
    valueChangeHandler = e => {
        this.setState({ newValue: e.target.value })
    }
    applyChanges = isApply => {
        if (isApply) {
            this.props.setNewValue(this.state.newValue)
        } else {
            this.setState({ newValue: this.props.item.value })
            this.props.stopEdit()
        }
    }
    render() {
        const { newValue } = this.state
        const { item, items, onSelect, selected, isEditing, setNewValue, stopEdit } = this.props
        const children = items
            .filter(_item => _item.parent === item.id)
            .map(_item => (
                <TreeItem
                    stopEdit={stopEdit}
                    setNewValue={setNewValue}
                    isEditing={isEditing}
                    key={_item.id}
                    item={_item}
                    items={items}
                    onSelect={onSelect}
                    selected={selected}
                />
            ))
        const treeClasses = [classes.TreeItem]
        if (selected === item.id) {
            treeClasses.push(classes.active)
        }
        if (item.deleted) {
            treeClasses.push(classes.deleted)
        }

        return (
            <Fragment>
                {isEditing && selected === item.id ? (
                    <div>
                        <input type="text" value={newValue} onChange={this.valueChangeHandler} />
                        <button onClick={() => this.applyChanges(true)}>OK</button>
                        <button onClick={() => this.applyChanges(false)}>NO</button>
                    </div>
                ) : (
                    <div
                        className={treeClasses.join(' ')}
                        onClick={() => {
                            !item.deleted && onSelect && onSelect(item.id)
                        }}
                    >
                        {item.parent && <FontAwesomeIcon icon={faLeaf} />}
                        <span>{item.value}</span>
                    </div>
                )}

                <div style={{ paddingLeft: 25 }}>{children}</div>
            </Fragment>
        )
    }
}

export default TreeItem
