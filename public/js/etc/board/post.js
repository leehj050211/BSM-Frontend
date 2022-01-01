let postNo = window.location.pathname.split('/')[3];
const boardPostChange = (changePostMo) => {
    postNo=changePostMo;
    history.pushState(null, null, `/board/${boardType}/${postNo}${window.location.search}`)
    postRefresh();
}
const postView = new Vue({
    el:'.post',
    data:{
        permission:false,
        memberProfile:'',
        memberInfoUrl:'',
        postTitle:'',
        postDate:'',
        postHit:'',
        postComments:'',
        memberNickname:'',
        postContent:'',
        postLike:0,
        like:0,
        commentTree:[],
        commentFocus:0
    },
    methods:{
        isParent:function(){
            return this.item.child && this.item.child.length
        }
    },
    updated(){
        this.$nextTick(function () {
            $$('.comment_item_content img[emoticon]').forEach(e => {
                e.src=`/resource/board/emoticon/${e.getAttribute('emoticon')}.png`;
                e.classList.add('emoticon');
            });
        })
    }
})
const postRefresh = () => {
    progress(20)
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'GET',
        url:`${apiUrl}/post/${boardType}/${postNo}`,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                $$('.post')[0].classList.remove('hide')
                $$('main')[0].scrollTop=0;
                postView.permission=data.permission;
                postView.memberCode=data.memberCode;
                postView.memberProfile=`/resource/member/profile_images/profile_${data.memberCode}.png`;
                postView.memberInfoUrl=`/memberinfo/${data.memberCode}`
                postView.postTitle=data.postTitle;
                postView.postDate=data.postDate;
                postView.postHit=data.postHit;
                postView.postComments=data.postComments;
                postView.memberNickname=data.memberNickname;
                postView.postContent=data.postContent;
                postView.like=data.like;
                postView.postLike=data.postLike;
                window.setTimeout(()=>{
                    // iframe영상을 화면에 꽉채우게 하기위해서 컨테이너로 감싸줌
                    // 바로 실행하면 요소가 dom에 렌더링되기 전에 실행되므로 딜레이를 줘서 실행
                    $('.note-video-clip').each((i, e) => {
                        $(e).wrap('<div class="video-container"></div>');
                    });
                },1);
                progress(50)
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
const postDelete = () => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'DELETE',
        url:`${apiUrl}/post/${boardType}/${postNo}`,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                window.location.href=`/board/${boardType}`;
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
const likeSend = like => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'POST',
        data:{
            like:like,
        },
        url:`${apiUrl}/like/${boardType}/${postNo}`,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                postView.like=data.like;
                postView.postLike=data.postLike;
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}

Vue.component('tree-item', {
    template:'#comment_item_template',
    props:{
        item:Object
    },
    computed:{
        isParent:function(){
            return this.item.child && this.item.child.length
        }
    }
})

const commentRefresh = () => {
    $$('.loading')[0].classList.add("on");
    progress(50)
    $.ajax({
        type:'GET',
        url:`${apiUrl}/comment/${boardType}/${postNo}`,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
            }else{
                postView.commentTree = data.arrComment;
                postView.commentFocus = 0;
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
            progress(100)
        }
    });
}

const commentDelete = commentIndex => {
    $$('.loading')[0].classList.add("on");
    $.ajax({
        type:'DELETE',
        url:`${apiUrl}/comment/${boardType}/${postNo}/${commentIndex}`,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}

const comment_write = (depth, parentIdx) => {
    $$('.loading')[0].classList.add("on");
    depth = parseInt(depth)+1;
    let url;
    if(parentIdx==null){
        url = `${apiUrl}/comment/${boardType}/${postNo}`;
    }else{
        url = `${apiUrl}/comment/${boardType}/${postNo}/${depth}/${parentIdx}`;
    }
    $.ajax({
        type:'POST',
        data:{
            comment:$('.post_comment').html(),
        },
        url:url,
        cache:false,
        success:data => {
            data=JSON.parse(data);
            if(data.status!=1){
                error_code(data.status, data.subStatus);
                refresh = false;
            }else{
                $('.post_comment').html("");
                commentRefresh();
            }
        },
        error:() => {
            error_code(0, 0);
        },
        complete:() => {
            $$('.loading')[0].classList.remove("on");
        }
    });
}
const insertEmoticon = (id) => {
    document.execCommand("insertHTML", true, `<img src="/resource/board/emoticon/${id}.png" emoticon="${id}">`)
}