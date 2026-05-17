/*---------------KHOI TAO SUPABASE--------------*/
const supabaseUrl = "https://xrnypvoftegcbnofdgqe.supabase.co";
const supabaseKey = "sb_publishable_5ZvyKacQvP8WhsxKqwXrlw_mTHX7fzv";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
/*---------------------------------------------------*/
const form = document.getElementById("myForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
function checkName() {
    const error = document.getElementById("name-error");
    const value = nameInput.value.trim();
    if (value === "") {
        error.innerText = "Vui lòng nhập họ tên";
        nameInput.classList.add("input-error");
        return false;
    }
    error.innerText = "";
    nameInput.classList.remove("input-error");
    return true;
}
function checkEmail() {
    const error = document.getElementById("email-error");
    const email = emailInput.value.trim();
    const hasAt = email.includes("@");
    const hasDot = email.includes(".");
    const validStart = !email.startsWith("@");
    if (email === "" || !hasAt || !hasDot || !validStart) {
        error.innerText = "Email không hợp lệ";
        emailInput.classList.add("input-error");
        return false;
    }
    error.innerText = "";
    emailInput.classList.remove("input-error");
    return true;
}

function checkPhone() {
    const error = document.getElementById("phone-error");
    const phone = phoneInput.value.trim();
    const enoughLength = (phone.length == 10);
    const startWithZero = phone.startsWith("0");
    const isNumber = !isNaN(phone);
    if (phone === "" || !enoughLength || !startWithZero || !isNumber) {
        error.innerText = "Số điện thoại không hợp lệ !";
        phoneInput.classList.add();
        return false;
    }
    error.innerText = "";
    phoneInput.classList.remove("input-error");
    return true;
}

function checkMessage() {
    const error = document.getElementById("message-error");
    if (messageInput.value.trim().length < 20) {
        error.innerText =
            "Nội dung tối thiểu 20 ký tự !";
        messageInput.classList.add("input-error");
        return false;
    }
    error.innerText = "";
    messageInput.classList.remove("input-error");
    return true;
}
nameInput.addEventListener("input", checkName);
emailInput.addEventListener("input", checkEmail);
phoneInput.addEventListener("input", checkPhone);
messageInput.addEventListener("input", checkMessage);
nameInput.addEventListener("blur", checkName);
emailInput.addEventListener("blur", checkEmail);
phoneInput.addEventListener("blur", checkPhone );
messageInput.addEventListener("blur", checkMessage );
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const isNameOk = checkName();
    const isEmailOk = checkEmail();
    const isPhoneOk = checkPhone();
    const isMessageOk = checkMessage();
    if (!isNameOk || !isEmailOk || !isPhoneOk || !isMessageOk) {
        return;
    }
    try {
        const email = emailInput.value.trim();
        const { data, error } = await supabaseClient.from("Users").select("*").eq("email", email);
        if (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối database");
            return;
        }
        if (data.length === 0) {
            alert("Tài khoản không tồn tại, vui lòng đăng nhập");
            return;
        }
        const { error: insertError } = await supabaseClient
            .from("GopY")
            .insert([
                {ho_ten: nameInput.value.trim(), email: emailInput.value.trim(), sdt: phoneInput.value.trim(), "chu-de": document.getElementById("topic").value, "noi-dung": messageInput.value.trim()}
            ]);
        if (insertError) {
            console.error("Lỗi: ", insertError);
            alert("Góp ý thất bại !");
            return;
        }
        alert("Gửi góp ý thành công !");
        form.reset();
        window.location.href = "index.html";
    } catch (error) {
        console.error("Lỗi: ", error);
        alert("Lỗi !");
    }
});