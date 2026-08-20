import { useEffect, useState } from "react";
import { Edit3, Plus, Power } from "lucide-react";
import api from "../services/api.js";
import Modal from "../components/common/Modal.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import { getError } from "../utils/format.js";
import { useAuth } from "../context/AuthContext.jsx";

const configs = {
  categories: {
    title: "Categories",
    endpoint: "categories",
    fields: [
      ["name", "Name"],
      ["description", "Description"],
    ],
  },
  suppliers: {
    title: "Suppliers",
    endpoint: "suppliers",
    fields: [
      ["name", "Name"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["address", "Address"],
    ],
  },
  customers: {
    title: "Customers",
    endpoint: "customers",
    fields: [
      ["name", "Name"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["address", "Address"],
    ],
  },
};
const singular = (type) =>
  type === "categories" ? "category" : type.slice(0, -1);

export default function CatalogPage({ type }) {
  const config = configs[type];
  const { user } = useAuth();
  const canManage = ["owner", "manager"].includes(user?.role);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/${config.endpoint}`);
      setItems(response.data.data?.[config.endpoint] || []);
      setError("");
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [type]);

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    setForm({});
    setError("");
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = editing
        ? await api.put(`/${config.endpoint}/${editing._id}`, form)
        : await api.post(`/${config.endpoint}`, form);
      const key = config.endpoint.slice(0, -1);
      const savedItem = response.data.data?.[key];
      if (savedItem) {
        setItems((current) =>
          editing
            ? current.map((item) =>
                item._id === savedItem._id ? savedItem : item,
              )
            : [...current, savedItem].sort((a, b) =>
                a.name.localeCompare(b.name),
              ),
        );
      }
      closeModal();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id) => {
    if (!confirm("Deactivate this record?")) return;
    try {
      await api.delete(`/${config.endpoint}/${id}`);
      await load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setError("");
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(
      Object.fromEntries(config.fields.map(([key]) => [key, item[key] || ""])),
    );
    setError("");
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title={config.title}
        description={`Manage your ${type} records.`}
        action={
          canManage && (
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={17} /> Add {singular(type)}
            </button>
          )
        }
      />
      {error && !open && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="surface overflow-hidden">
        <div className="table-wrap">
          <table className="w-full text-sm">
            <thead className="table-head bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="p-4">Name</th>
                {config.fields.slice(1).map(([key, label]) => (
                  <th key={key}>{label}</th>
                ))}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={config.fields.length + 2}
                    className="p-10 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((item) => (
                  <tr className="border-t" key={item._id}>
                    <td className="p-4 font-bold">{item.name}</td>
                    {config.fields.slice(1).map(([key]) => (
                      <td key={key}>{item[key] || "-"}</td>
                    ))}
                    <td>
                      <span
                        className={`badge ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {canManage && (
                        <div className="flex gap-1">
                          <button
                            className="btn btn-secondary p-2!"
                            onClick={() => openEdit(item)}
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          {item.isActive && (
                            <button
                              className="btn btn-danger p-2!"
                              onClick={() => deactivate(item._id)}
                              title="Deactivate"
                            >
                              <Power size={15} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={config.fields.length + 2}
                    className="p-10 text-center text-slate-400"
                  >
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={open}
        onClose={closeModal}
        title={`${editing ? "Edit" : "Add"} ${singular(type)}`}
      >
        <form onSubmit={save} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {config.fields.map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              {key === "description" || key === "address" ? (
                <textarea
                  className="input"
                  rows="3"
                  value={form[key] || ""}
                  onChange={(event) =>
                    setForm({ ...form, [key]: event.target.value })
                  }
                />
              ) : (
                <input
                  className="input"
                  type={key === "email" ? "email" : "text"}
                  required={key === "name"}
                  value={form[key] || ""}
                  onChange={(event) =>
                    setForm({ ...form, [key]: event.target.value })
                  }
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
