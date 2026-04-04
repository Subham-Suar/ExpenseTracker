import { useEffect, useState } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, toDateInputValue } from "../lib/format";
import { motion, AnimatePresence } from "framer-motion";

const emptyForm = {
  description: "",
  amount: "",
  category: "",
  date: "",
};

// Framer motion variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function TransactionManager({
  title,
  accentClass,
  emptyText,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  typeLabel,
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const normalizeItems = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  };

  useEffect(() => {
    let ignore = false;

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchItems();
        const resolvedItems = normalizeItems(response);

        if (!ignore) {
          setItems(resolvedItems);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || `Unable to load ${typeLabel}.`);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      ignore = true;
    };
  }, [fetchItems, typeLabel]);

  const totalAmount = (Array.isArray(items) ? items : []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      const response = editingId
        ? await updateItem(editingId, payload)
        : await createItem(payload);

      const savedItem = response?.data ?? response;

      setItems((current) => {
        const safeCurrent = Array.isArray(current) ? current : [];
        if (!savedItem) return safeCurrent;
        if (editingId) return safeCurrent.map((item) => (item._id === editingId || item.id === editingId ? savedItem : item));
        return [savedItem, ...safeCurrent];
      });

      resetForm();
    } catch (submitError) {
      setError(submitError.message || `Unable to save ${typeLabel}.`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      description: item.description || "",
      amount: item.amount || "",
      category: item.category || "",
      date: toDateInputValue(item.date),
    });
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteItem(id);
      setItems((current) => current.filter((item) => item._id !== id));
      if (editingId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message || `Unable to delete ${typeLabel}.`);
    }
  }

  return (
    <section className="w-full p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">{title}</h1>
          <p className="text-slate-400 mt-2">Capture, review, and maintain your {typeLabel} records in one place.</p>
        </div>
        <div 
          className="bg-[#1E293B] border border-[#334155] px-6 py-4 rounded-xl flex flex-col items-end shrink-0"
          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.35)', transition: 'all 0.25s ease' }}
        >
          <span className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Total {typeLabel}</span>
          <strong className="text-2xl font-bold text-slate-100">{formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Form Card */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 rounded-[36px] border border-slate-800/80 h-full sticky top-24 transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_-30px_rgba(15,23,42,0.8)]"
          style={{ boxShadow: '0 18px 50px rgba(15,23,42,0.45)' }}
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-500" />
          <div className="relative mb-6 pb-4 border-b border-slate-800/70">
            <h2 className="text-2xl font-bold text-slate-50">{editingId ? `Edit ${typeLabel}` : `Add ${typeLabel}`}</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">Fill in a clear description, amount, category and date to instantly update your tracker.</p>
          </div>

          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">Description</label>
              <input
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-[24px] px-4 py-3 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 placeholder:text-slate-500 shadow-[0_14px_30px_-22px_rgba(7,89,133,0.45)]"
                style={{ transition: 'all 0.25s ease' }}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="e.g. Monthly Salary, Freelance project"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">Amount</label>
                <input
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-[24px] px-4 py-3 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 placeholder:text-slate-500 shadow-[0_14px_30px_-22px_rgba(7,89,133,0.45)]"
                  style={{ transition: 'all 0.25s ease' }}
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">Category</label>
                <input
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-[24px] px-4 py-3 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 placeholder:text-slate-500 shadow-[0_14px_30px_-22px_rgba(7,89,133,0.45)]"
                  style={{ transition: 'all 0.25s ease' }}
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="e.g. Salary, Food"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">Date</label>
              <input
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-[24px] px-4 py-3 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                style={{ transition: 'all 0.25s ease' }}
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                type="date"
                required
              />
            </div>

            {error ? <p className="text-red-400 text-sm font-medium p-3 bg-red-400/10 rounded-lg">{error}</p> : null}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold border border-cyan-400 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] hover:bg-cyan-400 transition-all duration-200 ${accentClass}`}
                type="submit" 
                disabled={submitting}
              >
                <PlusCircle size={18} />
                <span>{submitting ? "Saving..." : editingId ? "Update entry" : "Add entry"}</span>
              </button>
              {editingId ? (
                <button 
                  className="px-6 py-3.5 rounded-2xl font-bold transition-all border border-slate-700 text-slate-200 bg-slate-950 hover:bg-slate-900 hover:text-sky-300" 
                  type="button" 
                  onClick={resetForm}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </motion.article>

        {/* List Card */}
        <motion.article 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 rounded-[36px] border border-slate-800/70 shadow-[0_28px_100px_-40px_rgba(15,23,42,0.9)] flex flex-col h-full"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-500" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/70">
            <div className="min-w-0">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-50 tracking-tight truncate">Recent {title}</h2>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.8)]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              {items.length} records
            </span>
          </div>

          {loading && items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <div className="animate-pulse rounded-full h-12 w-12 bg-slate-700 mb-5" />
              <p className="text-sm text-slate-400 font-medium">Loading {typeLabel}…</p>
            </div>
          ) : null}

          {loading && items.length > 0 ? (
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-3 bg-slate-950/95 border-b border-slate-800 py-3 text-sm text-slate-300 backdrop-blur-xl">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
              Refreshing records…
            </div>
          ) : null}

          {!loading && !items.length ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <p className="text-sm text-slate-500 font-medium">{emptyText}</p>
            </div>
          ) : null}

          {items.length > 0 ? (
            <motion.div 
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item._id || item.id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                    whileHover={{ y: -2 }}
                    className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.8)] transition-all duration-300"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-500 opacity-80" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <strong className="text-lg font-semibold text-slate-100 tracking-tight block mb-1 truncate capitalize">{item.description}</strong>
                        <p className="text-sm text-slate-400 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">{item.category}</span>
                          <span>•</span>
                          <span>{formatDate(item.date)}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className={`text-2xl font-semibold ${accentClass}`}>{formatCurrency(item.amount)}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            type="button" 
                            onClick={() => handleEdit(item)} 
                            aria-label="Edit entry"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-sky-400 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDelete(item._id || item.id)} 
                            aria-label="Delete entry"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-rose-400 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </motion.article>
      </div>
    </section>
  );
}
