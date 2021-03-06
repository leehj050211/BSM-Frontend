const viewUsercode = window.location.pathname.split('/')[2];
const userInfoView = Vue.createApp({
    data() {
        return {
            user: {
                userType: '',
                usercode: 0,
                nickname: '',
                level: 0,
                created: 0,
                enrolled: 0,
                grade: 0,
                classNo: 0,
                studentNo: 0,
                name: '',
                permission: false
            }
        }
    }
}).mount('.user_info_wrap');

const viewUserInfo = () => {
    ajax({
        method:'get',
        url:`/account/${viewUsercode}`,
        callback:(data) => {
            Object.keys(userInfoView.user).forEach(e => {
                if (data.user[e] === undefined) {
                    userInfoView.user[e] = null;
                } else {
                    userInfoView.user[e] = data.user[e];
                }
            });
            userInfoView.user.usercode = viewUsercode;
            userInfoView.user.created = userInfoView.user?.created?.split(' ')[0]?? null;
            switch (data.user.userType) {
                case 'anonymous':
                    userInfoView.user.nickname="Anonymous";
                    userInfoView.user.level=0;
                    showAlert("익명 유저입니다");
                    break;
                case 'deleted':
                    showAlert("삭제된 유저입니다");
                    break;
                case 'none':
                    showAlert("유저를 찾을 수 없습니다");
                    break;
            }
        }
    })
}

const profileUpload = () => {
    const form = $('#profile_upload');
    const formData = new FormData(form);
    ajax({
        method:'post',
        payload:formData,
        url:'/account/profile',
        callback:() => {
            alert("업로드에 성공하였습니다.\n캐시때문에 사진이 변경되지 않을 수 있으니\n기다리거나 캐시 삭제를 해주시면 됩니다");
            window.location.reload();
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    viewUserInfo();
    $('#profile_upload').onsubmit = (event) => {
        event.preventDefault();
        profileUpload();
    }
})