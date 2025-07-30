import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    let result = products;
    if (keyword)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    if (type) result = result.filter((p) => p.type === type);
    setFiltered(result);
  }, [keyword, type]);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Danh sách sản phẩm</h2>
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Tìm tên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">--Loại--</option>
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Tên</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Ngày nhập</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.quantity}</td>
                  <td>{p.importDate}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-success"
                      to={`/edit/${p.id}`}
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Không tìm thấy sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
