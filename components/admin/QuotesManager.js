"use client";

import { useState } from "react";
import { updateQuoteRequestStatusAction } from "@/app/actions";
import { 
  ClipboardList, 
  Download, 
  CheckSquare, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Building,
  AlertCircle,
  Loader2,
  Check,
  Search,
  Scale
} from "lucide-react";

export default function QuotesManager({ initialQuotes }) {
  const [quotes, setQuotes] = useState(initialQuotes || []);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    const quote = quotes.find(q => q.id === id);
    if (quote && quote.status === "pending") {
      handleStatusChange(id, "processed");
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoadingId(id);
    setError("");
    try {
      const res = await updateQuoteRequestStatusAction(id, status);
      if (res.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setLoadingId(null);
    }
  };

  // CSV Export Logic
  const handleExportCSV = () => {
    if (filteredQuotes.length === 0) {
      alert("No quote requests to export.");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Product Name",
      "Volume/Quantity",
      "Requester Name",
      "Company",
      "Email",
      "Phone",
      "Status",
      "Message"
    ];

    const rows = filteredQuotes.map(q => [
      q.id,
      new Date(q.created_at).toISOString(),
      q.product_name,
      q.quantity,
      q.name,
      q.company,
      q.email,
      q.phone || "",
      q.status,
      (q.message || "").replace(/"/g, '""').replace(/\r?\n/g, ' ') // escape double quotes & newlines
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quotes_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply filters
  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === "All" || q.status === statusFilter.toLowerCase();
    const matchesSearch = 
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filters & Export Row */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-surface border border-on-surface/10 rounded-lg p-5 shadow-xs">
        
        {/* Left Side: Status Buttons & Search */}
        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search company, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border border-on-surface/15 rounded pl-9 pr-3 py-1.5 font-body-md text-xs text-on-surface cursor-pointer w-full focus:border-primary focus:ring-0"
            />
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 border border-on-surface/10 rounded p-1 bg-surface-container-lowest">
            {["All", "Pending", "Processed", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`font-label-md text-[11px] px-3 py-1.5 rounded transition-all ${
                  statusFilter === status
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: CSV Export Action */}
        <button
          onClick={handleExportCSV}
          className="w-full lg:w-auto bg-primary text-on-primary font-label-md text-xs px-4 py-2.5 rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Download size={14} /> Export filtered CSV
        </button>
      </div>

      {success && (
        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* Quote Requests List */}
      <div className="space-y-4">
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => {
            const isExpanded = expandedId === quote.id;
            const isLoading = loadingId === quote.id;
            const dateStr = new Date(quote.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div 
                key={quote.id}
                className={`bg-surface border rounded-lg transition-all ${
                  isExpanded ? "border-primary/40 shadow-sm" : "border-on-surface/10 hover:border-on-surface/20"
                } overflow-hidden`}
              >
                {/* Header row */}
                <div 
                  onClick={() => toggleExpand(quote.id)}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                    quote.status === "pending" ? "bg-secondary/5 font-semibold" : "bg-transparent"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        quote.status === "pending" ? "bg-secondary animate-pulse" : 
                        quote.status === "processed" ? "bg-primary" : "bg-on-surface-variant/40"
                      }`} />
                      <h4 className="font-semibold text-primary">{quote.product_name}</h4>
                      <span className="text-xs text-on-surface-variant/70 font-mono">Qty: {quote.quantity}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-mono">
                      <span>Requester: <strong className="text-on-surface font-semibold">{quote.name}</strong> ({quote.company})</span>
                      <span>•</span>
                      <span>Date: {dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded ${
                      quote.status === "pending" ? "bg-secondary-container text-on-secondary-container" :
                      quote.status === "processed" ? "bg-primary-container text-on-primary-container" :
                      "bg-surface-container-high text-on-surface-variant/85"
                    }`}>
                      {quote.status}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="p-6 border-t border-on-surface/10 bg-surface-container-low space-y-5 animate-slideDown">
                    {/* Contacts details widgets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-surface border border-on-surface/5 p-3.5 rounded flex items-center gap-3 text-xs shadow-xs">
                        <Building size={16} className="text-secondary shrink-0" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Company Name</p>
                          <p className="font-semibold text-on-surface">{quote.company}</p>
                        </div>
                      </div>
                      <div className="bg-surface border border-on-surface/5 p-3.5 rounded flex items-center gap-3 text-xs shadow-xs">
                        <Mail size={16} className="text-secondary shrink-0" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Corporate Email</p>
                          <a href={`mailto:${quote.email}`} className="font-semibold text-primary hover:underline">{quote.email}</a>
                        </div>
                      </div>
                      <div className="bg-surface border border-on-surface/5 p-3.5 rounded flex items-center gap-3 text-xs shadow-xs">
                        <Phone size={16} className="text-secondary shrink-0" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Phone Number</p>
                          {quote.phone ? (
                            <a href={`tel:${quote.phone}`} className="font-semibold text-on-surface hover:underline">{quote.phone}</a>
                          ) : (
                            <span className="font-semibold text-on-surface-variant/50">Not Provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Target Volume */}
                      <div className="bg-surface border border-on-surface/5 p-4 rounded space-y-1.5 shadow-xs">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                          <Scale size={12} className="text-secondary" /> Volume Requested
                        </span>
                        <p className="text-sm font-semibold text-primary">{quote.quantity}</p>
                      </div>

                      {/* Product Name */}
                      <div className="bg-surface border border-on-surface/5 p-4 rounded space-y-1.5 shadow-xs">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant block">Ingredient Registry</span>
                        <p className="text-sm font-semibold text-on-surface">{quote.product_name}</p>
                      </div>
                    </div>

                    {/* Project details / Message */}
                    {quote.message && (
                      <div className="bg-surface border border-on-surface/5 p-5 rounded space-y-2 shadow-xs">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Extra Specifications / Packing instructions</p>
                        <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-body-md">
                          {quote.message}
                        </p>
                      </div>
                    )}

                    {/* Status Update Actions */}
                    <div className="pt-4 border-t border-on-surface/5 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs text-on-surface-variant font-mono">
                        Quote ID: <code className="bg-surface px-1.5 py-0.5 rounded text-[10px]">{quote.id}</code>
                      </span>
                      <div className="flex gap-2">
                        {quote.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(quote.id, "completed")}
                            disabled={isLoading}
                            className="bg-secondary text-on-secondary text-xs font-label-md px-4 py-2 rounded hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <CheckSquare size={14} />}
                            Mark as Completed
                          </button>
                        )}
                        {quote.status !== "processed" && quote.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(quote.id, "processed")}
                            disabled={isLoading}
                            className="border border-on-surface/20 text-on-surface-variant text-xs font-label-md px-4 py-2 rounded hover:bg-on-surface/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <Clock size={14} />}
                            Mark as Processed
                          </button>
                        )}
                        {quote.status !== "pending" && (
                          <button
                            onClick={() => handleStatusChange(quote.id, "pending")}
                            disabled={isLoading}
                            className="border border-on-surface/20 text-on-surface-variant text-xs font-label-md px-4 py-2 rounded hover:bg-on-surface/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <Clock size={14} />}
                            Mark as Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-surface border border-on-surface/10 rounded-lg">
            <ClipboardList size={40} className="text-on-surface-variant/40 mx-auto mb-2" />
            <p className="font-body-lg text-on-surface-variant">No quote requests logged under the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
