class TagsCreator {
    constructor() {
        this.tags = new Set();
        this.readonly = false;
        this.idx = 0;
    }

    get Tags() {
        return this.tags;
    }

    set Tags(value) {
        if (!this.readonly) {
            this._clear();
            this.clearLocalStorage();

            new Set(value.split(' ')).forEach(element => {
                if (element) {
                    this.setLocalStorage(`text_${this.idx}`, element);
                    const obj = {
                        key: `text_${this.idx}`,
                        text: element,
                        content: `
                          <div class="comp">
                            <div class="text">${element}</div>
                            <button class="close">x</button>
                          </div>
                        `
                    }
                    this.tags.add(obj);
                    this.idx++;
                }
            });
        }
    }

    setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    loadLocalStorage() {
        let values = '',
            keys = Object.keys(localStorage);

        for (let i = 0; i < keys.length; i++) {
            values += localStorage.getItem(keys[i]);
            values += ' ';
        }

        this.Tags = values;

        return values;
    }

    removeLocalStorage(key) {
        localStorage.removeItem(key);
    }

    clearLocalStorage() {
        localStorage.clear();
    }

    add(tag) {
        const obj = {
            text: tag,
            content: `
        	<div class="comp">
          	<div class="text">${tag}</div>
            <button class="close">x</button>
          </div>
        `
        }

        this.tags.add(obj);
    }

    _clear() {
        this.tags.clear();
    }

    delete(tag) {
        this.tags.forEach(el => {
            if (tag === el.text) {
                this.tags.delete(el);
                this.removeLocalStorage(el.key);
            }
        })
    }

    changeReadonly(chbox) {
        if (chbox.checked) {
            this.readonly = true;
        } else {
            this.readonly = false;
        }
    }
}

function updateTags(tags) {
    document.querySelector('.tags').innerHTML = '';
    for (let tag of tags) {
        document.querySelector('.tags').insertAdjacentHTML('beforeend', tag.content);
    }
}

const tagsCreator = new TagsCreator();

globalThis.tagsCreator = tagsCreator;

document.querySelector('.form').addEventListener('click', e => {
    if (e.target.className === 'add') {
        tagsCreator.Tags = document.querySelector('input').value;
        console.log(document.querySelector('input').value);
        document.querySelector('input').value = '';
        updateTags(tagsCreator.Tags);
    }

    if (e.target.className === 'close') {
        tagsCreator.delete(e.target.parentNode.querySelector('.text').textContent);
        e.target.parentNode.remove();
    }
});

tagsCreator.loadLocalStorage();
updateTags(tagsCreator.Tags);