import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    type: "",
    quantity: "",
    importDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!product.name) errs.name = "Tên không được để trống";
    else if (product.name.length > 100) errs.name = "Tên không quá 100 ký tự";

    if (!product.type) errs.type = "Phải chọn loại";

    const today = new Date();
    const [d, m, y] = product.importDate.split("/").map(Number);
    const importDate = new Date(y, m - 1, d);
    if (!product.importDate) errs.importDate = "Ngày nhập không được trống";
    else if (importDate > today) errs.importDate = "Ngày nhập không hợp lệ";

    if (!product.quantity || product.quantity <= 0)
      errs.quantity = "Số lượng phải > 0";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await API.put(`/products/${id}`, product);
    toast.success("Cập nhật thành công");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="container py-4">
      <form
        className="mx-auto p-4 border rounded shadow-sm bg-white"
        style={{ maxWidth: 500 }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">Cập nhật sản phẩm</h2>
        <div className="mb-3">
          <label className="form-label">Tên:</label>
          <input
            className="form-control"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          {errors.name && (
            <div className="text-danger small mt-1">{errors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Loại:</label>
          <select
            className="form-select"
            value={product.type}
            onChange={(e) => setProduct({ ...product, type: e.target.value })}
          >
            <option value="">--Chọn loại--</option>
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
          {errors.type && (
            <div className="text-danger small mt-1">{errors.type}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Số lượng:</label>
          <input
            className="form-control"
            type="number"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: Number(e.target.value) })
            }
          />
          {errors.quantity && (
            <div className="text-danger small mt-1">{errors.quantity}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Ngày nhập (dd/MM/yyyy):</label>
          <input
            className="form-control"
            value={product.importDate}
            onChange={(e) =>
              setProduct({ ...product, importDate: e.target.value })
            }
          />
          {errors.importDate && (
            <div className="text-danger small mt-1">{errors.importDate}</div>
          )}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
