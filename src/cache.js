import { decorate, observable } from 'mobx'
import { sortBy, cloneDeep } from 'lodash'

class AppCache {
    items = []

    loadItem = (id, db) => {
        if (!this.items.find(_item => _item.id === id)) {
            let item = db.getItem(id)
            let parent = item.parent ? this.items.find(_item => _item.id === item.parent) : null
            if (parent && parent.deleted) {
                item.deleted = true
            }
            this.items = sortBy([item, ...this.items], item => item.id)
            return item
        }
    }

    changeItem = (id, value) => {
        let item = this.items.find(_item => _item.id === id)
        if (item) {
            item.value = value
            item.adding && delete item.adding
        }
    }

    addItem = (id, value, parent) => {
        this.items.push({
            id,
            value,
            parent,
            adding: true,
        })
    }

    deleteItem = (id, silent) => {
        let item = this.items.find(_item => _item.id === id)
        let result = false
        if (item.adding || item.id < 0) {
            if (item.adding) {
                result = silent || window.confirm('Отменить добавление?')
            } else {
                result = silent || window.confirm('Удалить?')
            }
            if (result) {
                this.items = this.items.filter(_item => _item.id !== id)
            }
        } else {
            result = silent || window.confirm('Удалить?')
            if (result) {
                item.deleted = true
            }
        }
        if (result) {
            let childs = this.items.filter(_item => _item.parent === id)
            for (let child of childs) {
                this.deleteItem(child.id, true)
            }
        }

        return result
    }

    saveItems = db => {
        this.items = [...db.save(cloneDeep(this.items))]
    }

    reset = db => {
        this.items = []
        db.reset()
    }
}

decorate(AppCache, {
    items: observable,
})

const cache = new AppCache()

export default cache
