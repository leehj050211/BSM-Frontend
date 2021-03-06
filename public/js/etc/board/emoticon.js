let editor = null;
const focusEditor = () => {
    if (editor) {
        editor.focus({preventScroll: true});
    }
}
const emoticonView = Vue.createApp({
    data() {
        return {
            emoticon: [],
            emoticonIdx: 0,
            emoticonInfo: {}
        }
    },
    methods: {
        selectEmoticon: function(select) {
            this.emoticonIdx = select;
        }
    },
}).mount('.emoticon_popup');

const insertEmoticon = (id, idx, type) => {
    if (typeof tinymce != 'undefined' && editor == tinymce?.activeEditor?.contentDocument?.body) {
        tinymce.activeEditor.insertContent(`<img src="/resource/board/emoticon/${id}/${idx}.${type}" e_id="${id}" e_idx="${idx}" e_type="${type}" class="emoticon">`);
        return;
    }
    focusEditor();
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const emoticon = document.createElement('img');
    emoticon.src = `/resource/board/emoticon/${id}/${idx}.${type}`;
    emoticon.setAttribute('e_id', id);
    emoticon.setAttribute('e_idx', idx);
    emoticon.setAttribute('e_type', type);
    emoticon.classList.add('emoticon');
    range.insertNode(emoticon);
    range.setStartAfter(emoticon);
}
const loadEmoticon = () => {
    ajax({
        method:'get',
        url:`/emoticon`,
        callback:(data) => {
            emoticonView.emoticon = data.emoticon;
        }
    })
    popupOpen($('.insert_emoticon_box'));
}
const loadEmoticonInfo = (id) => {
    ajax({
        method:'get',
        url:`/emoticon/${id}`,
        callback:(data) => {
            if (data.emoticon) {
                data.emoticon.created = data.emoticon.created.split(' ')[0];
                emoticonView.emoticonInfo = data.emoticon;
            }else{
                showAlert('이모티콘 정보를 불러올 수 없습니다');
            }
        }
    })
    popupOpen($('.emoticon_info_box'));
}