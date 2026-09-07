"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, Save, CheckCircle2, AlertCircle, RefreshCw, 
  Layout, Image as ImageIcon, Type, HelpCircle, Layers
} from "lucide-react";
import { api } from "@/services/api";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "traditional" | "gallery" | "plans" | "audience">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for each section
  const [heroContent, setHeroContent] = useState({
    titleLine1: "Work Better.",
    titleLine2: "Together.",
    subtitle: "Premium flexible workspaces, inspiring environments and a global community to help your business thrive.",
  });

  const [traditionalContent, setTraditionalContent] = useState({
    badge: "Bye Bye To",
    titlePart1: "Traditional",
    titlePart2: "Office Investments",
    subtitle: "Launch Your Business in Major Cities Without the High Costs",
    feature1Title: "High-Speed Wi-Fi & Power Backup",
    feature1Desc: "Stay connected all day with fast internet and uninterrupted power.",
    feature2Title: "Fully Furnished Workspaces",
    feature2Desc: "Step in and start working with ready-to-use modern workstations.",
    feature3Title: "Meeting & Conference Rooms",
    feature3Desc: "Host clients or teams in professional, well-equipped meeting rooms.",
    feature4Title: "Reception & Mail Handling Support",
    feature4Desc: "Get your calls, mails, and couriers managed with complete care.",
  });

  const [galleryContent, setGalleryContent] = useState({
    titlePart1: "Explore",
    titlePart2: "Our Gallery",
    subtitle: "Discover beautifully designed coworking areas, meeting rooms, and virtual office setups that spark productivity and creativity.",
    img1: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    img2: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    img3: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    img4: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    img5: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
  });

  const [plansContent, setPlansContent] = useState({
    badge: "Work spaces Plans",
    titlePart1: "Building A",
    titlePart2: "Better Workspace",
    subtitle: "We create flexible, fully supported workspaces where businesses of every size can focus on what truly matters—growing, creating, and making an impact.",
    virtualOfficeMonthly: "799",
    virtualOfficeDaily: "26",
    virtualOfficeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  });

  const [audienceContent, setAudienceContent] = useState({
    titlePart1: "Whether You're a Freelancer, Startup, or Remote Team -",
    titlePart2: "NexusHub Coworking",
    titlePart3: "Has a Space for You",
    subtitle: "At NexusHub Coworking, we understand the needs of every professional. Our cowork space is designed to serve four distinct groups according to your needs, work style, and situation.",
    freelancerDesc: "Working from home sounds great, but it comes with a lot of distractions, isolation, and a lack of a professional environment. A coworking space is best for freelancers.",
    startupDesc: "For start-ups and early-stage teams, there is no sense in investing in office set-up for the initial days. Opt for a co-work space, which gives an affordable option.",
    remoteDesc: "Working remotely from home full-time has productivity, professional, and psychological costs for remote workers. We offer the structure and social connection that home offices lack.",
    smeDesc: "Nowadays, going to an office is also about flexible office space without investing in a commercial lease. We provide private cabins and dedicated team cabins with fully served services.",
  });

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings");
      const data = res.data?.data || {};

      if (data.cms_hero) setHeroContent((prev) => ({ ...prev, ...data.cms_hero }));
      if (data.cms_traditional) setTraditionalContent((prev) => ({ ...prev, ...data.cms_traditional }));
      if (data.cms_gallery) setGalleryContent((prev) => ({ ...prev, ...data.cms_gallery }));
      if (data.cms_plans) setPlansContent((prev) => ({ ...prev, ...data.cms_plans }));
      if (data.cms_audience) setAudienceContent((prev) => ({ ...prev, ...data.cms_audience }));
    } catch (err) {
      console.error("Failed to load CMS content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const payload = {
        cms_hero: heroContent,
        cms_traditional: traditionalContent,
        cms_gallery: galleryContent,
        cms_plans: plansContent,
        cms_audience: audienceContent,
      };

      const token = localStorage.getItem("token");
      await api.put("/settings", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: "success", text: "Homepage CMS Content updated successfully!" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update CMS content." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-neutral-500">Loading Homepage CMS Settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-serif font-black text-neutral-900 tracking-tight">
              Homepage CMS Content Manager
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Super Admin Panel to dynamically edit text, headings, icons, pricing &amp; gallery images on the Homepage.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving Changes..." : "Save Homepage Content"}</span>
        </button>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "hero" ? "bg-neutral-950 text-white shadow-sm" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
          }`}
        >
          1. Hero Banner
        </button>
        <button
          onClick={() => setActiveTab("traditional")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "traditional" ? "bg-neutral-950 text-white shadow-sm" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
          }`}
        >
          2. Bye Bye Traditional Office
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "gallery" ? "bg-neutral-950 text-white shadow-sm" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
          }`}
        >
          3. Gallery Grid
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "plans" ? "bg-neutral-950 text-white shadow-sm" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
          }`}
        >
          4. Better Workspace Plans
        </button>
        <button
          onClick={() => setActiveTab("audience")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "audience" ? "bg-neutral-950 text-white shadow-sm" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
          }`}
        >
          5. Target Audience Cards
        </button>
      </div>

      {/* TAB 1: HERO BANNER */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-500" /> 1. Main Hero Banner Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Hero Title Line 1</label>
              <input
                type="text"
                value={heroContent.titleLine1}
                onChange={(e) => setHeroContent({ ...heroContent, titleLine1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Hero Title Line 2</label>
              <input
                type="text"
                value={heroContent.titleLine2}
                onChange={(e) => setHeroContent({ ...heroContent, titleLine2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Hero Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRADITIONAL OFFICE */}
      {activeTab === "traditional" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Layout className="w-5 h-5 text-rose-500" /> 2. Bye Bye To Traditional Office Investments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-6 border-b border-neutral-100">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Small Top Badge Text</label>
              <input
                type="text"
                value={traditionalContent.badge}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Title Part 1 (Black)</label>
              <input
                type="text"
                value={traditionalContent.titlePart1}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, titlePart1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Title Part 2 (Rose Red Glow)</label>
              <input
                type="text"
                value={traditionalContent.titlePart2}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, titlePart2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4 Feature Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <span className="text-xs font-extrabold text-neutral-500 font-mono">FEATURE 1</span>
              <input
                type="text"
                value={traditionalContent.feature1Title}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature1Title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-bold"
                placeholder="Title"
              />
              <textarea
                rows={2}
                value={traditionalContent.feature1Desc}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature1Desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-medium"
                placeholder="Description"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <span className="text-xs font-extrabold text-neutral-500 font-mono">FEATURE 2</span>
              <input
                type="text"
                value={traditionalContent.feature2Title}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature2Title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-bold"
                placeholder="Title"
              />
              <textarea
                rows={2}
                value={traditionalContent.feature2Desc}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature2Desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-medium"
                placeholder="Description"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <span className="text-xs font-extrabold text-neutral-500 font-mono">FEATURE 3</span>
              <input
                type="text"
                value={traditionalContent.feature3Title}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature3Title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-bold"
                placeholder="Title"
              />
              <textarea
                rows={2}
                value={traditionalContent.feature3Desc}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature3Desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-medium"
                placeholder="Description"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200/80 space-y-3">
              <span className="text-xs font-extrabold text-neutral-500 font-mono">FEATURE 4</span>
              <input
                type="text"
                value={traditionalContent.feature4Title}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature4Title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-bold"
                placeholder="Title"
              />
              <textarea
                rows={2}
                value={traditionalContent.feature4Desc}
                onChange={(e) => setTraditionalContent({ ...traditionalContent, feature4Desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-medium"
                placeholder="Description"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GALLERY GRID */}
      {activeTab === "gallery" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" /> 3. Gallery Grid Photos
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Gallery Image 1 (Top Left)</label>
              <input
                type="text"
                value={galleryContent.img1}
                onChange={(e) => setGalleryContent({ ...galleryContent, img1: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Gallery Image 2 (Top Right)</label>
              <input
                type="text"
                value={galleryContent.img2}
                onChange={(e) => setGalleryContent({ ...galleryContent, img2: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Gallery Image 3 (Bottom Left)</label>
              <input
                type="text"
                value={galleryContent.img3}
                onChange={(e) => setGalleryContent({ ...galleryContent, img3: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Gallery Image 4 (Bottom Right)</label>
              <input
                type="text"
                value={galleryContent.img4}
                onChange={(e) => setGalleryContent({ ...galleryContent, img4: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Gallery Image 5 (Large Right Vertical Image)</label>
              <input
                type="text"
                value={galleryContent.img5}
                onChange={(e) => setGalleryContent({ ...galleryContent, img5: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BETTER WORKSPACE PLANS */}
      {activeTab === "plans" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" /> 4. Building A Better Workspace Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Virtual Office Monthly Price (₹)</label>
              <input
                type="text"
                value={plansContent.virtualOfficeMonthly}
                onChange={(e) => setPlansContent({ ...plansContent, virtualOfficeMonthly: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Virtual Office Per Day Price (₹)</label>
              <input
                type="text"
                value={plansContent.virtualOfficeDaily}
                onChange={(e) => setPlansContent({ ...plansContent, virtualOfficeDaily: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Virtual Office Card Image URL</label>
              <input
                type="text"
                value={plansContent.virtualOfficeImage}
                onChange={(e) => setPlansContent({ ...plansContent, virtualOfficeImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TARGET AUDIENCE CARDS */}
      {activeTab === "audience" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-500" /> 5. Target Audience Cards Descriptions
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200 space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Freelancers Description</label>
              <textarea
                rows={3}
                value={audienceContent.freelancerDesc}
                onChange={(e) => setAudienceContent({ ...audienceContent, freelancerDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200 space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Startups &amp; Early-Stage Teams Description</label>
              <textarea
                rows={3}
                value={audienceContent.startupDesc}
                onChange={(e) => setAudienceContent({ ...audienceContent, startupDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200 space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Remote Workers Description</label>
              <textarea
                rows={3}
                value={audienceContent.remoteDesc}
                onChange={(e) => setAudienceContent({ ...audienceContent, remoteDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-neutral-200 space-y-2">
              <label className="text-xs font-bold text-neutral-800 block">Established SMEs Description</label>
              <textarea
                rows={3}
                value={audienceContent.smeDesc}
                onChange={(e) => setAudienceContent({ ...audienceContent, smeDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
