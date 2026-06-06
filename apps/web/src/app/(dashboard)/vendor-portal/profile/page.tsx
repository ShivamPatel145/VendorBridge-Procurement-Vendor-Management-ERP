'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Building2, Mail, MapPin, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface VendorProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address: string;
  taxId?: string;
  website?: string;
  status: string;
  rating?: number;
  category?: {
    name: string;
    description?: string;
  };
  user?: {
    email: string;
    name: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }>;
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors/me');
      const data = response.data?.data || response.data?.vendor;
      setProfile(data);
    } catch (error: any) {
      console.error('Failed to load vendor profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#14B8A6]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">No vendor profile found. Please contact administrator.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Company Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your business details and compliance information — live from database.</p>
        </div>
        <button 
          onClick={() => toast.info('Profile editing coming soon!')} 
          className="bg-card border border-border text-foreground hover:bg-muted font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Building2 className="w-10 h-10 text-indigo-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{profile.companyName}</h1>
                  <StatusBadge status={profile.status} />
                  {profile.rating && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded">
                      ⭐ {profile.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  {profile.category?.description || 'Professional vendor providing quality services and products.'}
                </p>
                {profile.category && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#14B8A6]/10 text-[#14B8A6] px-2.5 py-1 rounded-full">
                      <Briefcase className="w-3 h-3" /> {profile.category.name}
                    </span>
                  </div>
                )}
                {profile.website && (
                  <div className="mt-2">
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#14B8A6] hover:underline">
                      🌐 {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tax ID / Registration</p>
                <p className="font-mono text-sm text-foreground">{profile.taxId || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Primary Contact</p>
                <p className="text-sm font-semibold text-foreground">{profile.contactPerson}</p>
                <p className="text-sm text-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {profile.user?.email || 'N/A'}
                </p>
                <p className="text-sm text-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {profile.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Business Address
                </h3>
             </div>
             <div className="p-6">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  <strong>{profile.companyName}</strong><br/>
                  {profile.address}
                </p>
             </div>
          </div>
        </div>

        {/* Right Column - Compliance */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Documents
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {profile.documents && profile.documents.length > 0 ? (
                profile.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.fileType}</p>
                    </div>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#14B8A6] hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded yet</p>
              )}
            </div>
            <div className="p-4 bg-muted/30 border-t border-border text-center">
               <button 
                 onClick={() => toast.info('Document upload coming soon!')} 
                 className="text-xs font-bold text-[#14B8A6] hover:underline"
               >
                 Upload New Document
               </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">Account Information</h3>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Vendor ID</p>
                <p className="font-mono text-foreground">{profile.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Account Status</p>
                <StatusBadge status={profile.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
