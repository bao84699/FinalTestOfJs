/*--------------- KHOI TAO SUPABASE --------------*/
const supabaseUrl = "https://xrnypvoftegcbnofdgqe.supabase.co";
const supabaseKey = "sb_publishable_5ZvyKacQvP8WhsxKqwXrlw_mTHX7fzv";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
/*--------------- KHAI BÁO BIẾN DÙNG CHUNG --------------*/
const tbody = document.querySelector("#book-list");
const deleteModal = document.getElementById('deleteModal');
const btnCancel = document.getElementById('btnCancel');
const btnConfirm = document.getElementById('btnConfirm');
const addModal = document.getElementById('addModal');
const btnOpenAddModal = document.getElementById('addBook'); 
const btnCloseAddModal = document.getElementById('btnCloseAddModal');
const addBookForm = document.getElementById('addBookForm');
let xoaDong = null;
let maSachHienTai = null;
const tenBang = "Books";
/*--------------- TẢI DỮ LIỆU SÁCH --------------*/
async function loadBooks() {
    try {
        let { data, error } = await supabaseClient.from(tenBang).select("*");
        if (error) throw error; 
        if (!data || data.length === 0) {
            console.log("Đang lấy dữ liệu từ Open Library...");
            const response = await fetch("https://openlibrary.org/search.json?q=truyen");
            const resData = await response.json(); 
            const openLibraryBooks = resData.docs?.slice(0, 30) || [];      
            const booksToInsert = openLibraryBooks.map((book) => {
                const thumbnail = book.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                    : "asset/Pictures/no-image-icon.png";
                return {
                    thumbnail,
                    tieu_de: book.title,
                    tac_gia: book.author_name?.join(", ") || "Không rõ",
                    gia: Math.floor(Math.random() * 150000 + 50000),
                    danh_muc: book.subject?.[0] || "Chưa phân loại",
                    mo_ta: book.key ? `https://openlibrary.org${book.key}` : "#"
                };
            });
            const { data: insertedData, error: insertError } = await supabaseClient
                .from(tenBang)
                .insert(booksToInsert)
                .select();

            if (insertError) throw insertError;
            data = insertedData;
        }
        tbody.innerHTML = "";   
        if (data && Array.isArray(data)) {
            data.forEach((book) => {
                tbody.innerHTML += `
                    <tr data-key="${book.id}">
                        <td>${String(book.id).padStart(4, "0")}</td> 
                        <td>
                            <img src="${book.thumbnail}" width="45px" alt="thumbnail" style="border-radius: 4px;">
                        </td>
                        <td class="book-title">${book.tieu_de}</td>
                        <td>${book.tac_gia}</td>
                        <td>${Number(book.gia).toLocaleString("vi-VN")} VND</td>
                        <td>${book.danh_muc}</td>
                        <td><div class="trang-thai">Đang bán</div></td>
                        <td>
                            <div class="action-btn">
                                <div class="button delete-btn"><i data-lucide="trash"></i></div>
                                <div class="button edit-btn"><i data-lucide="square-pen"></i></div>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
        lucide.createIcons();
    } catch (error) {
        console.error("Lỗi tải danh sách sách:", error);
    }
}
/*--------------- SỰ KIỆN SỬA, XÓA SÁCH --------------*/
tbody.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");
    if (deleteBtn) {
        xoaDong = deleteBtn.closest("tr");
        maSachHienTai = xoaDong.getAttribute("data-key");
        deleteModal.classList.add("show");
    }
    if (editBtn) {
        const targetRow = editBtn.closest("tr");
        const bookId = targetRow.getAttribute("data-key");
        try {
            const { data: book, error } = await supabaseClient.from(tenBang).select("*").eq("id", bookId).single(); 
            if (error) throw error;
            document.getElementById("editBookId").value = book.id;
            document.getElementById("editTitle").value = book.tieu_de;
            document.getElementById("editAuthor").value = book.tac_gia;
            document.getElementById("editPrice").value = book.gia;
            document.getElementById("editCategory").value = book.danh_muc;
            document.getElementById("editThumbnail").value = book.thumbnail;
            const editModal = document.getElementById("editModal");
            editModal.classList.add("show");
            lucide.createIcons();
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sách để sửa:", error);
            alert("Không thể tải thông tin sách!");
        }
    }
});
function closeDeleteModal() {
    deleteModal.classList.remove("show");
    xoaDong = null;
    maSachHienTai = null;
}
btnCancel.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});
btnConfirm.addEventListener('click', async () => {
    if (xoaDong && maSachHienTai) {
        try {
            const { error } = await supabaseClient.from(tenBang).delete().eq('id', maSachHienTai);
            if (error) throw error;
            xoaDong.remove();
            console.log(`Đã xóa sách có ID: ${maSachHienTai} khỏi Supabase.`);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại, vui lòng kiểm tra lại kết nối!");
        } finally {
            closeDeleteModal();
        }
    }
});
loadBooks();
/*--------------- XỬ LÍ THÊM SÁCH MỚI --------------*/
if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
        addModal.classList.add('show');
        lucide.createIcons(); 
    });
}
function closeAddModal() {
    addModal.classList.remove('show');
    addBookForm.reset(); 
}
if (btnCloseAddModal) {
    btnCloseAddModal.addEventListener('click', closeAddModal);
}
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeAddModal();
});
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmitAdd = document.getElementById('btnSubmitAdd');
    const tieu_de = document.getElementById('addTitle').value.trim();
    const tac_gia = document.getElementById('addAuthor').value.trim();
    const gia = parseInt(document.getElementById('addPrice').value, 10);
    const danh_muc = document.getElementById('addCategory').value;   
    const thumbnail = document.getElementById('addThumbnail').value.trim() || "asset/Pictures/no-image-icon.png";
    const dataInserted = { tieu_de, tac_gia, gia, danh_muc, thumbnail };
    try {
        btnSubmitAdd.disabled = true;
        btnSubmitAdd.textContent = "Đang lưu...";
        const { error } = await supabaseClient.from(tenBang).insert([dataInserted]);
        if (error) throw error;
        alert("Thêm sách mới lên hệ thống thành công!");
        closeAddModal();
        await loadBooks();
    } catch (error) {
        console.error("Lỗi khi đẩy dữ liệu lên Supabase:", error);
        alert("Thêm sách thất bại!");
    } finally {
        btnSubmitAdd.disabled = false;
        btnSubmitAdd.textContent = "Lưu sách";
    }
});
/*--------------- XỬ LÍ SỬA SÁCH --------------*/
const editModal = document.getElementById('editModal');
const btnCloseEditModal = document.getElementById('btnCloseEditModal');
const editBookForm = document.getElementById('editBookForm');
function closeEditModal() {
    editModal.classList.remove('show');
    editBookForm.reset();
}
if (btnCloseEditModal) {
    btnCloseEditModal.addEventListener('click', closeEditModal);
}
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});
editBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmitEdit = document.getElementById('btnSubmitEdit');
    const id = document.getElementById('editBookId').value;
    const tieu_de = document.getElementById('editTitle').value.trim();
    const tac_gia = document.getElementById('editAuthor').value.trim();
    const gia = parseInt(document.getElementById('editPrice').value, 10);
    const danh_muc = document.getElementById('editCategory').value;
    const thumbnail = document.getElementById('editThumbnail').value.trim() || "asset/Pictures/no-image-icon.png";
    const dataUpdated = { tieu_de, tac_gia, gia, danh_muc, thumbnail };
    try {
        btnSubmitEdit.disabled = true;
        btnSubmitEdit.textContent = "Đang cập nhật...";
        const { error } = await supabaseClient
            .from(tenBang)
            .update(dataUpdated)
            .eq('id', id);

        if (error) throw error;

        alert("Cập nhật thông tin sách thành công!");
        closeEditModal();
        await loadBooks();
    } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu lên Supabase:", error);
        alert("Cập nhật thất bại!");
    } finally {
        btnSubmitEdit.disabled = false;
        btnSubmitEdit.textContent = "Cập nhật";
    }
});
document.getElementById("logOut").addEventListener("click", ()=> {
    window.location.href = "index.html";
})