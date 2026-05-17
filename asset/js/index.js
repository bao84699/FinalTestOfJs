lucide.createIcons();
/*---------------KHOI TAO SUPABASE--------------*/
const supabaseUrl = "https://xrnypvoftegcbnofdgqe.supabase.co";
const supabaseKey = "sb_publishable_5ZvyKacQvP8WhsxKqwXrlw_mTHX7fzv";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
/*-------------------------------------------*/
const adminBtn = document.getElementById('admin');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownBtn = document.getElementById('dropdownBtn');
const overlay = document.querySelector('.overlay');
const uploadForm = document.querySelector('.upload-form');
const uploadBtn = document.getElementById("upload-file");
const fileInput = document.getElementById("file-input");
const title = document.querySelector(".title");
const fileName = document.getElementById("fileName");
const wrapper = document.querySelector('.mascot-wrapper');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
}
adminBtn.addEventListener('click', function(e) {
    if (document.getElementById('upload-item')) return;
    const passInput = prompt("Vui lòng nhập mật khẩu Admin:");
    const adminPassword = "123"; // Thay pass 
    if (passInput === adminPassword) {
        window.location.href = "dashboard.html";
    } else if (passInput !== null) {
        alert("Sai mật khẩu!");
    }
});
let hideTimeout;
wrapper.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    wrapper.classList.add('is-active');
});
wrapper.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
        wrapper.classList.remove('is-active');
    }, 900);
});     

/*------------PHẦN CARD VÀ BỘ LỌC--------------*/
const cardContainer = document.getElementById("cardContainer");
const filterCategory = document.getElementById("filterCategory");
const filterPrice = document.getElementById("filterPrice");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

let allBooksData = []; 
async function loadCardBooks() {
    try {
        if (allBooksData.length === 0) {
            const { data, error } = await supabaseClient.from("Books").select("*");
            if (error) throw error;
            allBooksData = data || [];
        }
        const selectedCategory = filterCategory.value;
        const selectedPriceRange = filterPrice.value;
        const filteredBooks = allBooksData.filter((book) => {
            const matchCategory = (selectedCategory === "ALL" || book.danh_muc === selectedCategory);
            let matchPrice = true;
            if (selectedPriceRange === "UNDER_100") {
                matchPrice = book.gia < 100000;
            } else if (selectedPriceRange === "OVER_100") {
                matchPrice = book.gia >= 100000;
            }
            return matchCategory && matchPrice;
        });
        cardContainer.innerHTML = "";
        if (filteredBooks.length === 0) {
            cardContainer.innerHTML = `<p style="padding: 20px; color: #888;">Không tìm thấy tài liệu phù hợp.</p>`;
            return;
        }
        filteredBooks.forEach((book) => {
            cardContainer.innerHTML += `
                <div class="item" data-id="${book.id}">
                    <div class="pic">
                        <img src="${book.thumbnail}" alt="bìa sách">
                    </div>
                    <div class="descript">
                        <p class = "book-card-title">${book.tieu_de}</p>
                        <span class = "gia-sach">${Number(book.gia).toLocaleString("vi-VN")} VND</span>
                    </div>
                    <div class="action-btn">
                        <button class="view" onclick="xemChiTietSach(${book.id})">Xem chi tiết</button>
                    </div>
                </div>
            `;
        });
        lucide.createIcons();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu thẻ Card:", error);
    }
}
filterCategory.addEventListener("change", loadCardBooks);
filterPrice.addEventListener("change", loadCardBooks);
arrowRight.addEventListener("click", () => {
    cardContainer.scrollBy({
        left: 500,
        behavior: "smooth" 
    });
});
arrowLeft.addEventListener("click", () => {
    cardContainer.scrollBy({
        left: -500,
        behavior: "smooth"
    });
});
async function xemChiTietSach(id) {
    try {
        const { data: book, error } = await supabaseClient
            .from("Books")
            .select("mo_ta")
            .eq("id", id)
            .single();
        if (error) throw error;
        if (book && book.mo_ta && book.mo_ta !== "#") {
            window.open(book.mo_ta, "_blank");
        } else {
            alert("Tài liệu tự thêm này chưa có link trang chi tiết!");
        }
    } catch (error) {
        console.error("Lỗi khi mở trang chi tiết:", error);
    }
}
loadCardBooks();