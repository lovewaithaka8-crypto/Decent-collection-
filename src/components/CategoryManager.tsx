import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryItemConfig } from '../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, FolderTree, Save, ArrowUp, ArrowDown } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { settings, updateSettings, products } = useStore();

  const categories = settings.customCategories || [
    { id: 'shoes', name: 'Shoes & Footwear', icon: '👞', hidden: false },
    { id: 'suits', name: 'Executive Suits', icon: '👔', hidden: false },
    { id: 'shirts', name: 'Shirts & Tops', icon: '👕', hidden: false },
    { id: 'jeans', name: 'Jeans & Trousers', icon: '👖', hidden: false },
    { id: 'accessories', name: 'Leather Accessories', icon: '💼', hidden: false },
    { id: 'women', name: 'Women\'s Collection', icon: '👗', hidden: false },
    { id: 'kids', name: 'Kids & Boys Wear', icon: '👦', hidden: false },
    { id: 'sportswear', name: 'Sportswear & Golf', icon: '⛳', hidden: false }
  ];

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCategory: CategoryItemConfig = {
      id,
      name: newCatName.trim(),
      icon: newCatIcon || '🏷️',
      hidden: false
    };

    const updated = [...categories, newCategory];
    updateSettings({ customCategories: updated });
    setNewCatName('');
    setNewCatIcon('🏷️');
    alert(`New Category "${newCategory.name}" added successfully!`);
  };

  const handleToggleHide = (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, hidden: !c.hidden } : c);
    updateSettings({ customCategories: updated });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      const updated = categories.filter(c => c.id !== id);
      updateSettings({ customCategories: updated });
    }
  };

  const handleSaveEdit = (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, name: editName, icon: editIcon } : c);
    updateSettings({ customCategories: updated });
    setEditingCatId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateSettings({ customCategories: copy });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <FolderTree className="w-6 h-6 text-[#D4AF37]" />
              <span>Super Admin - Categories & Taxonomy Manager</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Add, edit, hide, or reorder categories. Changes instantly update the customer shop sidebar, header menu, and category filters.
            </p>
          </div>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="bg-[#111111] p-4 rounded-xl border border-[#222222] flex flex-wrap gap-3 items-end mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-300 font-bold block mb-1">New Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Perfumes & Fragrances"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333333] text-white text-xs rounded-lg p-2.5 outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="w-24">
            <label className="text-xs text-gray-300 font-bold block mb-1">Icon / Emoji</label>
            <input
              type="text"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333333] text-white text-xs rounded-lg p-2.5 outline-none text-center"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-lg uppercase shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

        {/* Categories Table */}
        <div className="overflow-x-auto border border-[#2B2B2B] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Icon</th>
                <th className="p-3">Category Name</th>
                <th className="p-3">Category ID</th>
                <th className="p-3">Active Products</th>
                <th className="p-3">Visibility</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {categories.map((cat, idx) => {
                const prodCount = products.filter(p => p.category === cat.id).length;
                const isEditing = editingCatId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-[#222222]">
                    <td className="p-3 flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === categories.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    <td className="p-3 text-lg">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          className="w-10 bg-[#111111] text-white p-1 rounded text-center border"
                        />
                      ) : (
                        cat.icon
                      )}
                    </td>

                    <td className="p-3 font-bold text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-[#111111] text-white p-1 rounded border"
                        />
                      ) : (
                        cat.name
                      )}
                    </td>

                    <td className="p-3 font-mono text-gray-400 text-[10px]">{cat.id}</td>

                    <td className="p-3 font-mono font-bold text-[#D4AF37]">
                      {prodCount} items
                    </td>

                    <td className="p-3">
                      {cat.hidden ? (
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">Hidden</span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">Visible</span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-1">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded hover:bg-emerald-600/40"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditName(cat.name);
                            setEditIcon(cat.icon);
                          }}
                          className="p-1.5 bg-[#222222] text-gray-300 rounded hover:bg-[#333333]"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleHide(cat.id)}
                        className="p-1.5 bg-[#222222] text-amber-400 rounded hover:bg-[#333333]"
                        title={cat.hidden ? 'Unhide Category' : 'Hide Category'}
                      >
                        {cat.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
