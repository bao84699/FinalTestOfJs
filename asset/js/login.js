lucide.createIcons();
/*---------------KHOI TAO SUPABASE--------------*/
const supabaseUrl = "https://xrnypvoftegcbnofdgqe.supabase.co";
const supabaseKey = "sb_publishable_5ZvyKacQvP8WhsxKqwXrlw_mTHX7fzv";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/*---------------XU LI CHUYEN FORM--------------*/
const dangNhap = document.querySelector('.dang-nhap');
const dangKi = document.querySelector('.dang-ki');
const formDangNhap = document.getElementById('dang-nhap-form');
const formDangKi = document.getElementById('dang-ki-form');
dangNhap.addEventListener("click", ()=> {
    dangNhap.classList.add("active-log");
    dangKi.classList.remove("active-log");
    formDangNhap.classList.add("active");
    formDangKi.classList.remove("active")
})
dangKi.addEventListener("click", ()=> {
    dangNhap.classList.remove("active-log");
    dangKi.classList.add("active-log");
    formDangNhap.classList.remove("active");
    formDangKi.classList.add("active")
})
/*---------------XU LI NHAP LIEU DAU VAO FORM DANG KI--------------*/
const btnRegister = document.getElementById("btn-register");
const notification = document.querySelector(".notification");
btnRegister.addEventListener("click", async (e)=> {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email-register").value.trim();
    const password = document.getElementById("password-register").value.trim();
    const loiName = document.getElementById("loi-name");
    const loiEmail = document.getElementById("loi-email-register");
    const loiPassword = document.getElementById("loi-matkhau-register");
    let check = 0;
    loiPassword.style.display = "none";
    loiEmail.style.display = "none";
    loiName.style.display = "none";
    if(name == "") {
        loiName.style.display = "flex";
        check = 1;
    }
    if(email == "") {
        loiEmail.textContent = "Vui lòng nhập địa chỉ Email !";
        loiEmail.style.display = "flex";
        check = 1;
    } else if (!email.includes("@") || !email.includes(".com")) {
        loiEmail.style.display = "flex";
        loiEmail.textContent = "Vui lòng nhập đúng định dạng Email !";
        check = 1;
    }
    if (password.length < 6) {
        check = 1;
        loiPassword.style.display = "flex";
    }
    if(check == 0) {
        const {data, error} = await supabaseClient.from("Users").insert([{
            name: name, email: email, password: password
        }]);
        if (error != null) {
            console.log(error);
        } else {
            notification.style.transform = "translateX(0)";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    }
})
const passwordInput = document.getElementById("password-register");
const loiPassword = document.getElementById("loi-matkhau-register");
passwordInput.addEventListener("input", checkPasswordStrong);
function checkPasswordStrong() {
    const password = passwordInput.value;
    if(password.length < 6) {
        loiPassword.style.display = "flex";
        loiPassword.textContent = "Mật khẩu quá ngắn";
        loiPassword.style.color = "red";
        return;
    }
    let thuong = 0;
    let hoa = 0;
    let so = 0;
    let dacbiet = 0;
    let dodai = 0;
    if (password.length >= 6) dodai = 1;
    for(let i = 0; i < password.length; i++) {
        if(password[i] >= 'a' && password[i] <= 'z') thuong = 1;
        if(password[i] >= 'A' && password[i] <= 'Z') hoa = 1;
        if(password[i] >= '0' && password[i] <= '9') so = 1;
        if( password[i] === '!' || password[i] === '@' || password[i] === '#' || password[i] === '$' || password[i] === '%') dacbiet = 1;
    }
    let checkStrong = thuong + hoa + so + dacbiet + dodai;
    loiPassword.style.display = "flex";
    if(checkStrong >= 3) {
        loiPassword.textContent = "Mật khẩu mạnh";
        loiPassword.style.color = "green";
    }
    else if(checkStrong >= 2) {
        loiPassword.textContent = "Mật khẩu trung bình";
        loiPassword.style.color = "orange";
    }
    else {
        loiPassword.textContent = "Mật khẩu yếu";
        loiPassword.style.color = "red";
    }
}
/*---------------XU LI NHAP LIEU DAU VAO FORM DANG NHAP--------------*/
const btnLogin = document.getElementById("btn-login");
btnLogin.addEventListener("click", async (e)=> {
    e.preventDefault();
    const email = document.getElementById("email-login").value.trim();
    const password = document.getElementById("password-login").value.trim();
    const loiEmail = document.getElementById("loi-email");
    const loiPassword = document.getElementById("loi-matkhau");
    let check = 0;
    loiPassword.style.display = "none";
    loiEmail.style.display = "none";
    if(email == "") {
        loiEmail.textContent = "Vui lòng nhập địa chỉ Email !";
        loiEmail.style.display = "flex";
        check = 1;
    } else if (!email.includes("@") || !email.includes(".com")) {
        loiEmail.style.display = "flex";
        loiEmail.textContent = "Vui lòng nhập đúng định dạng Email !";
        check = 1;
    }
    if (password.length < 6) {
        check = 1;
        loiPassword.style.display = "flex";
    }
    if (check == 0) {
        const {data, error} = await supabaseClient.from("Users").select("name,password").eq("email", email);
        if (data.length == 0) {
            loiEmail.textContent = "Email không tồn tại !";
        }
        if (data[0].password == password) {
            notification.style.transform = "translateX(0)";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            loiPassword.textContent = "Mật khẩu sai!";
        }
    }
})