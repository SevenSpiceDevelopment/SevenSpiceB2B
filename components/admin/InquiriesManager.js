"use client";

import { useState } from "react";
import { updateInquiryStatusAction } from "@/app/actions";
import { 
  Inbox, 
  CheckCircle, 
  BookOpen, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Building,
  AlertCircle,
  Loader2,
  Check
} from "lucide-react";

export default function InquiriesManager({ initialInquiries }) {
  const [inquiries, setInquiries] = useState(initialInquiries || []);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState("All");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    // Mark as read automatically if expanded and currently unread
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry && inquiry.status === "unread") {
      handleStatusChange(id, "read");
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoadingId(id);
    setError("");
    try {
      const res = await updateInquiryStatusAction(id, status);
      if (res.success) {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to update inquiry status.");
    } finally {
      setLoadingId(null);
    }
  };

  // Get distinct interests
  const interests = ["All", ...new Set(inquiries.map(i => i.product_interest))];

  // Apply filters
  const filteredInquiries = inquiries.filter(i => {
    const matchesStatus = statusFilter === "All" || i.status === statusFilter.toLowerCase();
    const matchesInterest = interestFilter === "All" || i.product_interest === interestFilter;
    return matchesStatus && matchesInterest;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filters Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface border border-on-surface/10 rounded-lg p-5 shadow-xs">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 border border-on-surface/10 rounded p-1 bg-surface-container-lowest">
            {["All", "Unread", "Read", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`font-label-md text-xs px-3.5 py-2 rounded transition-all ${
                  statusFilter === status
                    ? "bg-secondary-container text-on-secondary-container font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Product Interest filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-mono uppercase">Interest:</span>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="bg-transparent border border-on-surface/15 rounded px-2.5 py-1.5 font-body-md text-xs text-on-surface cursor-pointer focus:border-primary focus:ring-0"
            >
              {interests.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-on-surface-variant/75">
          Filtered records: <strong>{filteredInquiries.length}</strong> / {inquiries.length}
        </span>
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

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            const isLoading = loadingId === inquiry.id;
            const dateStr = new Date(inquiry.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div 
                key={inquiry.id}
                className={`bg-surface border rounded-lg transition-all ${
                  isExpanded ? "border-primary/40 shadow-sm" : "border-on-surface/10 hover:border-on-surface/20"
                } overflow-hidden`}
              >
                {/* Header row click-to-expand */}
                <div 
                  onClick={() => toggleExpand(inquiry.id)}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                    inquiry.status === "unread" ? "bg-primary/5 font-semibold" : "bg-transparent"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        inquiry.status === "unread" ? "bg-primary animate-pulse" : 
                        inquiry.status === "read" ? "bg-secondary" : "bg-on-surface-variant/40"
                      }`} title={`Status: ${inquiry.status}`} />
                      <h4 className="font-semibold text-primary">{inquiry.name}</h4>
                      <span className="text-xs text-on-surface-variant/70 font-mono">({inquiry.company})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-mono">
                      <span>Interest: <strong className="text-on-surface font-semibold">{inquiry.product_interest}</strong></span>
                      <span>•</span>
                      <span>Submitted: {dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded ${
                      inquiry.status === "unread" ? "bg-primary-container text-on-primary-container" :
                      inquiry.status === "read" ? "bg-secondary-container text-on-secondary-container" :
                      "bg-surface-container-high text-on-surface-variant/85"
                    }`}>
                      {inquiry.status}
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
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Company</p>
                          <p className="font-semibold text-on-surface break-words">{inquiry.company}</p>
                        </div>
                      </div>
                      <div className="bg-surface border border-on-surface/5 p-3.5 rounded flex items-center gap-3 text-xs shadow-xs">
                        <Mail size={16} className="text-secondary shrink-0" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Corporate Email</p>
                          <a href={`mailto:${inquiry.email}`} className="font-semibold text-primary hover:underline break-all">{inquiry.email}</a>
                        </div>
                      </div>
                      <div className="bg-surface border border-on-surface/5 p-3.5 rounded flex items-center gap-3 text-xs shadow-xs">
                        <Phone size={16} className="text-secondary shrink-0" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Phone Number</p>
                          {inquiry.phone ? (
                            <a href={`tel:${inquiry.phone}`} className="font-semibold text-on-surface hover:underline">{inquiry.phone}</a>
                          ) : (
                            <span className="font-semibold text-on-surface-variant/50">Not Provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Project details / Message */}
                    <div className="bg-surface border border-on-surface/5 p-5 rounded space-y-2 shadow-xs">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">Formulated Specifications / Project Message</p>
                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-body-md break-words">
                        {inquiry.message}
                      </p>
                    </div>

                    {/* Status Update Actions */}
                    <div className="pt-4 border-t border-on-surface/5 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs text-on-surface-variant font-mono">
                        Record ID: <code className="bg-surface px-1.5 py-0.5 rounded text-[10px]">{inquiry.id}</code>
                      </span>
                      <div className="flex gap-2">
                        {inquiry.status !== "resolved" && (
                          <button
                            onClick={() => handleStatusChange(inquiry.id, "resolved")}
                            disabled={isLoading}
                            className="bg-secondary text-on-secondary text-xs font-label-md px-4 py-2 rounded hover:opacity-90 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <CheckCircle size={14} />}
                            Mark as Resolved
                          </button>
                        )}
                        {inquiry.status === "unread" && (
                          <button
                            onClick={() => handleStatusChange(inquiry.id, "read")}
                            disabled={isLoading}
                            className="border border-on-surface/20 text-on-surface-variant text-xs font-label-md px-4 py-2 rounded hover:bg-on-surface/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <BookOpen size={14} />}
                            Mark as Read
                          </button>
                        )}
                        {inquiry.status !== "unread" && (
                          <button
                            onClick={() => handleStatusChange(inquiry.id, "unread")}
                            disabled={isLoading}
                            className="border border-on-surface/20 text-on-surface-variant text-xs font-label-md px-4 py-2 rounded hover:bg-on-surface/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <Clock size={14} />}
                            Mark as Unread
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
            <Inbox size={40} className="text-on-surface-variant/40 mx-auto mb-2" />
            <p className="font-body-lg text-on-surface-variant">No inquiries logged under the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
