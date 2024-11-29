// Hàm để hiển thị div và thay đổi hình ảnh tương ứng
function showInfo(infoId) {
    // Ẩn tất cả các div (info1, info2, info3)
    document.getElementById('info1').style.display = 'none';
    document.getElementById('info2').style.display = 'none';
    document.getElementById('info3').style.display = 'none';

    // Hiển thị div tương ứng với infoId
    document.getElementById(infoId).style.display = 'block';

    // Ẩn tất cả các hình ảnh
    document.getElementById('image1').style.display = 'none';
    document.getElementById('image2').style.display = 'none';
    document.getElementById('image3').style.display = 'none';

    // Hiển thị hình ảnh tương ứng với infoId
    if (infoId === 'info1') {
        document.getElementById('image1').style.display = 'block'; // Hiển thị hình ảnh đầu tiên
    } else if (infoId === 'info2') {
        document.getElementById('image2').style.display = 'block'; // Hiển thị hình ảnh thứ hai
    } else if (infoId === 'info3') {
        document.getElementById('image3').style.display = 'block'; // Hiển thị hình ảnh thứ ba
    }
}

// Hàm tự động chuyển qua các div sau mỗi 3 giây
let currentIndex = 0;
const infoIds = ['info1', 'info2', 'info3'];
const images = ['image1', 'image2', 'image3'];

function autoSwitchInfo() {
    // Ẩn tất cả các div và hình ảnh
    showInfo(infoIds[currentIndex]);

    // Cập nhật chỉ mục tiếp theo
    currentIndex = (currentIndex + 1) % infoIds.length;
}

// Gọi hàm tự động chuyển đổi mỗi 3 giây
setInterval(autoSwitchInfo, 3000); // 3000ms = 3 giây
