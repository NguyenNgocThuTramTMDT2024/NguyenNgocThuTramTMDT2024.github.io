// Khai báo biến để lưu số thứ tự (STT) của người dùng
let userIndex = 0;

// Hàm xử lý khi nhấn nút Lưu
function saveUserInfo() {
  const userName = $('#nameInput').val();
  const userAddress = $('#addressInput').val();

  if (userName.trim() === "" || userAddress.trim() === "") {
    alert("Vui lòng nhập đầy đủ tên và địa chỉ.");
    return;
  }

  const userInfo = {
    name: userName,
    address: userAddress
  };

  const userInfoJSON = JSON.stringify(userInfo);
  addToTable(userName, userAddress, userInfoJSON);

  // Gọi hàm đến back end để thêm vào CSDL

  $('#nameInput').val('');
  $('#addressInput').val('');
}

// Hàm thêm thông tin người dùng vào bảng HTML
function addToTable(userName, userAddress, userInfoJSON) {
  userIndex++;

  const table = $('#userTable tbody');
  const newRow = `<tr>
    <td>${userIndex}</td>
    <td>${userName}</td>
    <td>${userAddress}</td>
    <td>${userInfoJSON}</td>
    <td><input type="checkbox" class="deleteCheckbox" onchange="toggleDeleteInput()"></td>
  </tr>`;

  table.append(newRow);
}

// Hàm xóa người dùng dựa trên checkbox hoặc STT
function deleteUser() {
  const checkboxes = $('.deleteCheckbox');
  const table = $('#userTable tbody');
  let anyChecked = false;

  // Duyệt qua các checkbox từ cuối danh sách về đầu để xóa nhiều hàng mà không bị lỗi
  for (let i = checkboxes.length - 1; i >= 0; i--) {
    if (checkboxes[i].checked) {
      anyChecked = true;
      $(checkboxes[i]).closest('tr').remove();
      userIndex--; 

      // Gọi hàm delete ở PHP

    }
  }

  // Nếu không có checkbox nào được chọn, xóa theo STT
  if (!anyChecked) {
    const deleteIndex = $('#deleteIndex').val();

    if (deleteIndex.trim() === "" || isNaN(deleteIndex) || deleteIndex <= 0 || deleteIndex > userIndex) {
      alert("Vui lòng nhập chỉ số hợp lệ.");
      return;
    }

    $('#userTable tbody tr').eq(deleteIndex - 1).remove();

    // Gọi hàm delete ở PHP
    userIndex--;
  }

  updateRowIndexes(); // Cập nhật lại STT sau khi xóa
  toggleDeleteInput(); // Cập nhật trạng thái trường nhập STT
}

// Cập nhật lại STT sau khi xóa
function updateRowIndexes() {
  $('#userTable tbody tr').each(function(index) {
    console.log(index);
    $(this).find('td:first').text(index + 1);
  });
}

// Hàm kiểm tra xem có checkbox nào được chọn hay không và vô hiệu hóa/khôi phục trường nhập STT
function toggleDeleteInput() {
  const checkboxes = $('.deleteCheckbox');
  let anyChecked = false;

  checkboxes.each(function() {
    if ($(this).is(':checked')) {
      anyChecked = true;
    }
  });

  $('#deleteIndex').prop('disabled', anyChecked);
}

// Gắn sự kiện vào nút Lưu và nút Xóa khi DOM đã sẵn sàng
$(document).ready(function() {
  $('#saveButton').on('click', saveUserInfo);
  $('#deleteButton').on('click', deleteUser);

  $('#userForm').on('keydown', function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành động mặc định của Enter (gửi form)
      saveUserInfo(); // Gọi hàm lưu thông tin
    }
  });
});








