import { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Firebase Folder/FirebaseConfig";
import { importJson } from "../Context/AddJson";
import { CANDIDATES } from "../utility/Constants";

/**
 * Admin – Candidates master list (Firestore → candidates)
 * -------------------------------------------------------
 * ✦ Live Firestore sync + filters
 * ✦ List candidates from remote API (only codes starting with STB…)
 * ✦ One‑click add (or Add All) for missing entries – maps API "subject" → ravi
 * ✦ Bulk JSON import remains for ad‑hoc uploads
 */

// ─── Helpers ────────────────────────────────────────────────────────────────
const COLLECTION = CANDIDATES; // 🔄 change to your desired collection name

const DEFAULT_FORM = {
  code: "",
  name: "",
  institution: "",
  place: "",
  dob: "",
  email: "",
  phone: "",
  ravi: "قالون عن نافع", // default – will be overwritten if API import
  secondroundsurah: "",
  finalroundsurah: "",
  isRecited: false, // still handy for progress & status filters
};

export default function Admin() {
  // ── State ────────────────────────────────────────────────────────────────
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // filters / search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // API / bulk import helpers
  const [remoteMissing, setRemoteMissing] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [bulkJson, setBulkJson] = useState("");

  // ── Firestore live subscription ──────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCandidates(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Derived data / helpers ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return candidates
      .filter((c) =>
        [c.name, c.code, c.place, c.institution].some((f) =>
          (f || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((c) => {
        if (statusFilter === "all") return true;
        return statusFilter === "recited" ? c.isRecited : !c.isRecited;
      });
  }, [candidates, searchTerm, statusFilter]);

  const recitedCount = candidates.filter((c) => c.isRecited).length;
  const progressPct = candidates.length ? (recitedCount / candidates.length) * 100 : 0;

  // ── Form change / submit ────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, COLLECTION, editingId), formData);
      } else {
        await addDoc(collection(db, COLLECTION), formData);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Save failed – see console");
    }
  };

  const edit = (c) => {
    setFormData({ ...DEFAULT_FORM, ...c });
    setEditingId(c.id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    await deleteDoc(doc(db, COLLECTION, id));
  };

  // ── Bulk JSON import (same as before) ─────────────────────────────────────
  const doBulkImport = async () => {
    if (!bulkJson.trim()) return;
    let list;
    try {
      list = JSON.parse(bulkJson);
      if (!Array.isArray(list)) throw new Error();
    } catch {
      return alert("Invalid JSON array");
    }
    const existing = new Set(candidates.map((c) => c.code.toLowerCase()));
    const toAdd = list.filter((u) => !existing.has((u.code || u.Code || "").toLowerCase()));
    if (!toAdd.length) return alert("All items already present");
    await Promise.all(
      toAdd.map((u) =>
        addDoc(collection(db, COLLECTION), normalizeApiUser(u))
      )
    );
    setBulkJson("");
    alert(`Imported ${toAdd.length}`);
  };

  // ── Remote API sync ───────────────────────────────────────────────────────
  const fetchRemote = async () => {
    setApiLoading(true);
    try {
      const res = await fetch("https://alshathibi.onrender.com/api/users");
      const data = await res.json();
      // keep only codes that start with STB (case‑insensitive)
      const stb = data.filter((u) => /^stb/i.test(u.Code || ""));
      const existing = new Set(candidates.map((c) => c.code.toLowerCase()));
      const missing = stb.filter((u) => !existing.has((u.Code || "").toLowerCase()));
      setRemoteMissing(missing);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch remote users");
    } finally {
      setApiLoading(false);
    }
  };

  const addRemote = async (u) => {
    await addDoc(collection(db, COLLECTION), normalizeApiUser(u));
    setRemoteMissing((p) => p.filter((x) => x.Code !== u.Code));
  };

  const addAllRemote = async () => {
    await Promise.all(remoteMissing.map((u) => addDoc(collection(db, COLLECTION), normalizeApiUser(u))));
    setRemoteMissing([]);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & progress */}
        <header className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Candidates Admin</h1>
          <div className="w-full bg-gray-200 h-3 rounded relative">
            <div style={{ width: `${progressPct}%` }} className="bg-green-500 h-3 rounded" />
            <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold">
              {recitedCount}/{candidates.length} recited
            </span>
          </div>
          {/* <button className="border-2" onClick={()=>importJson('auto','uloomquestions')}>import</button> */}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ── */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} Candidate</h2>
            <form onSubmit={save} className="space-y-4">
              <Field label="Code" name="code" value={formData.code} onChange={handleInput} required  />
              <Field label="Name" name="name" value={formData.name} onChange={handleInput} required />
              <Field label="Institution" name="institution" value={formData.institution} onChange={handleInput} />
              <Field label="Place" name="place" value={formData.place} onChange={handleInput} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="DOB" name="dob" type="date" value={formData.dob} onChange={handleInput} />
                <Field label="Phone" name="phone" value={formData.phone} onChange={handleInput} />
              </div>
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleInput} />
              <Field label="Ravi" name="ravi" value={formData.ravi} onChange={handleInput} />
              <Field label="Second‑round Surah" name="secondroundsurah" value={formData.secondroundsurah} onChange={handleInput} />
              <Field label="Final‑round Surah" name="finalroundsurah" value={formData.finalroundsurah} onChange={handleInput} />

              <div className="flex items-center">
                <input type="checkbox" name="isRecited" checked={formData.isRecited} onChange={handleInput} className="h-4 w-4 border-gray-300 rounded" />
                <label className="ml-2 text-sm">Has Recited</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingId && (
                  <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">Cancel</button>
                )}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </section>

          {/* ── List & Tools ── */}
          <section className="lg:col-span-2 space-y-8">
            {/* Search & status filter */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <Field
                label="Search"
                name="_search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, code, place…"
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded-md">
                <option value="all">All Status</option>
                <option value="recited">Recited</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Candidates ({filtered.length})</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Code",
                      "Name",
                      "Ravi",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length ? (
                    filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{c.code}</td>
                        <td className="px-6 py-4">{c.name}</td>
                        {/* <td className="px-6 py-4">{c.Place}</td> */}
                        <td className="px-6 py-4">{c.ravi}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${c.isRecited ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {c.isRecited ? "Recited" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => edit(c)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                          <button onClick={() => remove(c.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-sm text-gray-500">No candidates found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bulk & API */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="font-semibold">Bulk JSON Import</h3>
                <textarea rows={6} value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} className="w-full border p-2 rounded" placeholder="[{ code: 'STB123', … }]" />
                <button onClick={doBulkImport} className="bg-green-600 text-white px-4 py-2 rounded">Import JSON</button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="font-semibold">Sync from Remote API</h3>
                <button onClick={fetchRemote} disabled={apiLoading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                  {apiLoading ? "Loading…" : "Fetch Remote STB Users"}
                </button>

                {remoteMissing.length > 0 && (
                  <div className="max-h-56 overflow-y-auto border rounded p-2 space-y-1 text-sm">
                    {remoteMissing.map((u) => (
                      <div key={u.Code} className="flex justify-between bg-gray-50 rounded p-1 items-center">
                        <span>{u.Code} – {u.Name}</span>
                        <button onClick={() => addRemote(u)} className="text-blue-600 hover:underline">Add</button>
                      </div>
                    ))}
                  </div>
                )}

                {remoteMissing.length > 1 && (
                  <button onClick={addAllRemote} className="bg-indigo-600 text-white px-4 py-2 rounded">Add All ({remoteMissing.length})</button>
                )}
                {remoteMissing.length === 0 && !apiLoading && <p className="text-xs text-gray-600">All STB users are in Firestore ✅</p>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Field component ────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
        {...rest}
      />
    </div>
  );
}

// ─── Normalizer for API → Firestore ─────────────────────────────────────────
function normalizeApiUser(u) {
  return {
    code: u.Code || "",
    name: u.Name || "",
    institution: u.Institution || "",
    place: u.Place || "",
    dob: u.DOB || "",
    email: u.Email || "",
    phone: u.Phone || "",
    ravi: u.subject || "",
    secondroundsurah: "",
    finalroundsurah: "",
    isRecited: false,
  };
}
