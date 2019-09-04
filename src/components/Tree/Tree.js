import React from 'react'
import TreeItem from './TreeItem/TreeItem'
import styles from './Tree.module.css'

const findRoot = items => {
    let roots = []
    items.forEach(item => {
        if (!item.parent || (item.parent && !items.find(_item => item.parent === _item.id))) {
            roots.push(item)
        }
    })
    return roots
}

export default props => {
    const { items, onSelect, selected, isEditing, setNewValue, stopEdit } = props
    if (items) {
        const root = findRoot(items).map(item => (
            <TreeItem
                stopEdit={stopEdit}
                setNewValue={setNewValue}
                item={item}
                items={items}
                onSelect={onSelect}
                selected={selected}
                key={item.id}
                isEditing={isEditing}
            />
        ))
        return <div className={styles.TreeContainer}>{root}</div>
    } else {
        return <div className={styles.TreeContainer}>Чтото пошло не так</div>
    }
}
