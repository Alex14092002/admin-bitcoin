// Import các components từ Material UI
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Import các components từ project của bạn
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "./table.css"; // Đảm bảo bạn đã tạo file CSS này

function Tables() {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const getData = async () => {
    const res = await fetch(`https://server-bitcoin.vercel.app/api/user`);
    const dataAPI = await res.json();
    setData(dataAPI);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleOpenModal = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDepositAmount("");
  };
  const handleDepositSubmit = async () => {
    console.log(selectedUserId);
    try {
      // Parse depositAmount to a float and make sure it's a valid number
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Vui lòng nhập một số tiền hợp lệ.");
        return;
      }
      console.log(amount);

      const response = await fetch(
        `https://server-bitcoin.vercel.app/api/user/addbalance/${selectedUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Bạn có thể cần thêm token hoặc header khác tùy thuộc vào API của bạn
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!response.ok) {
        // Nếu server response không ok, throw error để bắt ở catch block
        throw new Error("Network response was not ok.");
      }

      const data = await response.json(); // Hoặc xử lý response phù hợp với API của bạn

      console.log("Nạp tiền thành công:", data);
      alert("Nạp tiền thành công.");
      getData();
      handleCloseModal();
      // Cập nhật lại state nếu cần thiết, ví dụ: setData(...)
    } catch (error) {
      console.error("Có lỗi xảy ra khi nạp tiền:", error);
      alert("Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.");
    }
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Danh sách tài khoản
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Số dư</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) => (
                      <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>{user.balance.toLocaleString()} VND</td>
                        <td>
                          <button onClick={() => handleOpenModal(user._id)}>Nạp tiền</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="deposit-modal"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          <h2 id="deposit-modal-title">Nạp tiền</h2>
          <TextField
            label="Số tiền"
            type="number"
            fullWidth
            variant="outlined"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            InputProps={{
              endAdornment: <span>VND</span>,
            }}
          />
          <Button onClick={handleDepositSubmit} variant="contained" color="primary">
            Xác nhận
          </Button>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
