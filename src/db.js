import testData from './testData'
import { DB_STORAGE_KEY } from './config'
import { decorate, observable } from 'mobx'

class DataBase {
    constructor() {
        this.restoreData()
    }

    getItem = id => {
        return Object.assign({}, this.items.find(_item => _item.id === id))
    }

    save = items => {
        let newItems = [...this.items]
        items.forEach(item => {
            newItems = this.saveItem(item, newItems)
        })
        this.items = [...newItems]
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.items))
    }

    saveItem = (newItem, items) => {
        items = [...items]
        let item = items.find(_item => _item.id === newItem.id)
        if (item) {
            item.value = newItem.value
            item.deleted = newItem.deleted
            if (item.deleted) {
                let childs = items.filter(_item => _item.parent === item.id)
                childs.forEach(child => {
                    child.deleted = true
                    items = this.saveItem(child, items)
                })
            }
        } else {
            items.push(newItem)
        }

        return items
    }

    reset = () => {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(testData))
        this.restoreData()
    }

    restoreData = () => {
        let stored = localStorage.getItem(DB_STORAGE_KEY)
        if (stored) {
            try {
                this.items = JSON.parse(stored)
            } catch (e) {
                this.items = testData
                localStorage.removeItem(DB_STORAGE_KEY)
            }
        } else {
            this.items = testData
        }
    }
}

decorate(DataBase, {
    items: observable,
})

const db = new DataBase()

export default db
