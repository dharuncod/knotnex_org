import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventPoster } from '../../data/initialData';
import PencilIcon from './components/PencilIcon';
import GoogleCalendarDatePicker from './components/GoogleCalendarDatePicker';
import ClockTimePicker from './components/ClockTimePicker';
import CitySearchLocationPicker from './components/CitySearchLocationPicker';
import SessionItem from './components/SessionItem';
import SessionComposer from './components/SessionComposer';
import CoverCropScreen from './components/CoverCropScreen';
import EventEligibilityScreen from './components/EventEligibilityScreen';
import EventRegistrationFormBuilder from './components/EventRegistrationFormBuilder';
import BackButton from '../../components/common/BackButton';
import CreateEventSkeleton from '../../components/skeletons/pages/CreateEventSkeleton';

function parseEventData(ev) {
  if (!ev) {
    return {
      name: '',
      eventDate: '',
      eventTime: '',
      location: '',
      description: '',
      category: '',
      capacity: '',
      ticketPrice: '',
      speakers: '',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      coverImage: null,
      originalCoverImage: null,
      sessions: []
    };
  }

  let parsedDate = '';
  let parsedTime = '';
  if (ev.date) {
    if (ev.date.includes(' • ')) {
      const parts = ev.date.split(' • ');
      parsedDate = parts[0] || '';
      parsedTime = parts[1] || '';
    } else {
      parsedDate = ev.date;
      parsedTime = ev.time || '';
    }
  }

  let priceVal = '';
  if (ev.ticketPrice !== undefined && ev.ticketPrice !== null) {
    priceVal = typeof ev.ticketPrice === 'number' ? `₹${ev.ticketPrice}` : String(ev.ticketPrice);
  }

  let spkStr = '';
  if (Array.isArray(ev.speakers)) {
    spkStr = ev.speakers.map(s => (typeof s === 'string' ? s : s.name)).join(', ');
  } else if (ev.speakers) {
    spkStr = String(ev.speakers);
  }

  const poster = ev.poster || null;

  const initialSessions = (ev.sessions && ev.sessions.length > 0)
    ? ev.sessions
    : [];

  return {
    name: ev.name || '',
    eventDate: parsedDate,
    eventTime: parsedTime,
    location: ev.location || '',
    description: ev.description || '',
    category: ev.category || '',
    capacity: ev.capacity !== undefined ? String(ev.capacity) : '',
    ticketPrice: priceVal,
    speakers: spkStr,
    organizerName: ev.organizer || ev.organizedBy?.name || '',
    organizerEmail: ev.contact?.email || ev.organizerEmail || '',
    organizerPhone: ev.contact?.phone || ev.organizerPhone || '',
    coverImage: poster || null,
    originalCoverImage: ev.originalPoster || poster || null,
    sessions: initialSessions
  };
}

export default function CreateEventView({
  setEvents: propSetEvents,
  onNavigate: propOnNavigate,
  addToast: propAddToast
}) {
  const appContext = useApp() || {};
  const setEvents = propSetEvents || appContext.setEvents;
  const onNavigate = propOnNavigate || appContext.navigateTo;
  const addToast = propAddToast || appContext.showToast;
  const editingEvent = appContext.editingEvent || null;

  const initData = parseEventData(editingEvent);

  const [name, setName] = useState(initData.name);
  const [eventDate, setEventDate] = useState(initData.eventDate);
  const [eventTime, setEventTime] = useState(initData.eventTime);
  const [location, setLocation] = useState(initData.location);
  const [description, setDescription] = useState(initData.description);
  const [category, setCategory] = useState(initData.category);
  const [capacity, setCapacity] = useState(initData.capacity);
  const [ticketPrice, setTicketPrice] = useState(initData.ticketPrice);
  const [speakers, setSpeakers] = useState(initData.speakers);
  const [organizerName, setOrganizerName] = useState(initData.organizerName);
  const [organizerEmail, setOrganizerEmail] = useState(initData.organizerEmail);
  const [organizerPhone, setOrganizerPhone] = useState(initData.organizerPhone);
  const [eligibility, setEligibility] = useState('');
  const [sessions, setSessions] = useState(initData.sessions);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [currentStep, setCurrentStep] = useState('details'); // 'details' | 'eligibility' | 'formBuilder'
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [draftEventData, setDraftEventData] = useState(() => (editingEvent ? { ...editingEvent, poster: initData.coverImage, sessions: initData.sessions } : null));

  const changeStep = (nextStep) => {
    setIsStepLoading(true);
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) {
        mainArea.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };
    resetScroll();
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsStepLoading(false);
      resetScroll();
      requestAnimationFrame(resetScroll);
      setTimeout(resetScroll, 50);
      setTimeout(resetScroll, 250);
    }, 220);
  };

  useEffect(() => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) {
        mainArea.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentStep]);
  const [coverImage, setCoverImage] = useState(initData.coverImage);
  const [originalCoverImage, setOriginalCoverImage] = useState(initData.originalCoverImage);
  const [showCropScreen, setShowCropScreen] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      const data = parseEventData(editingEvent);
      setName(data.name);
      setEventDate(data.eventDate);
      setEventTime(data.eventTime);
      setLocation(data.location);
      setDescription(data.description);
      setCategory(data.category);
      setCapacity(data.capacity);
      setTicketPrice(data.ticketPrice);
      setSpeakers(data.speakers);
      setOrganizerName(data.organizerName);
      setOrganizerEmail(data.organizerEmail);
      setOrganizerPhone(data.organizerPhone);
      setCoverImage(data.coverImage);
      setOriginalCoverImage(data.originalCoverImage);
      setSessions(data.sessions);

      const mappedChiefGuests = Array.isArray(editingEvent.speakers)
        ? editingEvent.speakers.map((spk, idx) => {
            const spkName = typeof spk === 'string' ? spk : (spk.name || 'Guest Speaker');
            const cleanName = spkName.includes('(') ? spkName.split('(')[0].trim() : spkName;
            const role = typeof spk === 'object' && spk.role
              ? spk.role
              : (spkName.includes('(') ? spkName.split('(')[1].replace(')', '') : 'Keynote Speaker');
            const parts = cleanName.split(' ');
            const initials = parts.map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'SP';
            return {
              id: `spk-${idx + 1}`,
              initials,
              name: cleanName,
              role,
              verified: true
            };
          })
        : (editingEvent.chiefGuests || []);

      setDraftEventData({
        ...editingEvent,
        name: data.name,
        poster: data.coverImage,
        date: data.eventDate + (data.eventTime ? ' • ' + data.eventTime : ''),
        time: data.eventTime,
        location: data.location,
        category: data.category,
        capacity: data.capacity ? Number(data.capacity) : null,
        ticketPrice: data.ticketPrice,
        description: data.description,
        sessions: data.sessions,
        chiefGuests: mappedChiefGuests.length > 0 ? mappedChiefGuests : undefined,
        organizerData: editingEvent.organizerData || {
          initials: data.organizerName ? data.organizerName.substring(0, 2).toUpperCase() : '',
          name: data.organizerName,
          subtitle: 'Organizing Partner',
          verified: true
        },
        contact: editingEvent.contact || {
          email: data.organizerEmail,
          phone: data.organizerPhone,
          helpDesk: ''
        }
      });
      setCurrentStep('details');
    } else {
      const data = parseEventData(null);
      setName(data.name);
      setEventDate(data.eventDate);
      setEventTime(data.eventTime);
      setLocation(data.location);
      setDescription(data.description);
      setCategory(data.category);
      setCapacity(data.capacity);
      setTicketPrice(data.ticketPrice);
      setSpeakers(data.speakers);
      setOrganizerName(data.organizerName);
      setOrganizerEmail(data.organizerEmail);
      setOrganizerPhone(data.organizerPhone);
      setCoverImage(null);
      setOriginalCoverImage(null);
      setSessions([]);
      setDraftEventData(null);
      setCurrentStep('details');
    }
  }, [editingEvent]);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalCoverImage(event.target.result);
        setShowCropScreen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDraggingCover(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalCoverImage(event.target.result);
        setShowCropScreen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCrop = (croppedUrl) => {
    setCoverImage(croppedUrl);
    setShowCropScreen(false);
    if (addToast) addToast('Cover photo applied to event header!', 'success');
  };

  const handleSaveSession = (form) => {
    if (editingSessionId) {
      setSessions(prev => prev.map(s => s.id === editingSessionId ? { ...form, id: editingSessionId } : s));
      setEditingSessionId(null);
      if (addToast) addToast('Session updated successfully!', 'success');
    } else {
      setSessions(prev => [...prev, { ...form, id: Date.now().toString() }]);
      setIsAddingSession(false);
      if (addToast) addToast('Session added to schedule!', 'success');
    }
  };

  const handleStartEditSession = (s) => {
    setIsAddingSession(false);
    setEditingSessionId(s.id);
  };

  const handleCancelSession = () => {
    setIsAddingSession(false);
    setEditingSessionId(null);
  };

  const handleDeleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (editingSessionId === id) setEditingSessionId(null);
    if (addToast) addToast('Session deleted.', 'info');
  };

  const handleSaveDraft = () => {
    if (editingEvent) {
      handleDirectUpdate();
    } else {
      if (addToast) addToast('Draft saved!', 'success');
    }
  };

  const handleProceedToEligibility = () => {
    if (!name.trim()) { if (addToast) addToast('Event name is required.', 'error'); return; }
    if (!eventDate.trim()) { if (addToast) addToast('Event date is required.', 'error'); return; }
    if (!location.trim()) { if (addToast) addToast('Location is required.', 'error'); return; }
    if (!description.trim()) { if (addToast) addToast('Event description is required.', 'error'); return; }
    changeStep('eligibility');
  };

  const handleBack = () => {
    if (editingEvent) {
      if (appContext.setSelectedEventId) {
        appContext.setSelectedEventId(editingEvent.id);
      }
      if (appContext.setEditingEvent) {
        appContext.setEditingEvent(null);
      }
      if (onNavigate) {
        onNavigate('eventDetails');
      }
    } else {
      if (onNavigate) {
        onNavigate('events');
      }
    }
  };

  const handleDirectUpdate = () => {
    if (!name.trim()) { if (addToast) addToast('Event name is required.', 'error'); return; }
    if (!eventDate.trim()) { if (addToast) addToast('Event date is required.', 'error'); return; }
    if (!location.trim()) { if (addToast) addToast('Location is required.', 'error'); return; }
    if (!description.trim()) { if (addToast) addToast('Event description is required.', 'error'); return; }

    const targetId = editingEvent ? editingEvent.id : ('ev-' + Date.now());
    const updated = {
      ...(editingEvent || {}),
      id: targetId,
      name: name.trim(),
      poster: coverImage || (editingEvent ? editingEvent.poster : null),
      originalPoster: originalCoverImage || coverImage,
      date: eventDate + (eventTime ? ' • ' + eventTime : ''),
      time: eventTime,
      location: location.trim(),
      category: category.trim() || editingEvent?.category || '',
      capacity: capacity ? Number(capacity) : (editingEvent?.capacity ?? null),
      ticketPrice: ticketPrice.trim() || editingEvent?.ticketPrice || '',
      registered: editingEvent?.registered ?? 0,
      status: editingEvent?.status || 'upcoming',
      description: description.trim(),
      sessions: sessions || [],
      speakers: speakers ? speakers.split(',').map(s => s.trim()).filter(Boolean) : (editingEvent?.speakers || []),
      organizer: organizerName.trim() || editingEvent?.organizer || '',
      organizedBy: { name: organizerName.trim(), subtitle: organizerName.trim() },
      organizerData: {
        ...(editingEvent?.organizerData || {}),
        name: organizerName.trim(),
      },
      contact: {
        ...(editingEvent?.contact || {}),
        email: organizerEmail.trim() || editingEvent?.contact?.email || '',
        phone: organizerPhone.trim() || editingEvent?.contact?.phone || '',
      }
    };

    if (editingEvent) {
      if (appContext.updateEvent) {
        appContext.updateEvent(editingEvent.id, updated);
      } else if (setEvents) {
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? updated : e));
      }
      if (appContext.setSelectedEventId) {
        appContext.setSelectedEventId(editingEvent.id);
      }
      if (appContext.setEditingEvent) {
        appContext.setEditingEvent(null);
      }
      if (addToast) addToast(`Event "${updated.name}" updated successfully!`, 'success');
      if (onNavigate) {
        onNavigate('eventDetails');
      }
    } else {
      if (appContext.addEvent) {
        appContext.addEvent(updated);
      } else if (setEvents) {
        setEvents(prev => [updated, ...prev]);
      }
      if (appContext.setSelectedEventId) {
        appContext.setSelectedEventId(updated.id);
      }
      if (onNavigate) {
        onNavigate('eventDetails');
      }
    }
  };

  const handleSaveEligibilityDraft = (eligibilityData) => {
    if (editingEvent) {
      const targetId = editingEvent.id;
      const updated = {
        ...(editingEvent || {}),
        id: targetId,
        name: name.trim(),
        poster: coverImage || (editingEvent ? editingEvent.poster : null),
        originalPoster: originalCoverImage || coverImage,
        date: eventDate + (eventTime ? ' • ' + eventTime : ''),
        time: eventTime,
        location: location.trim(),
        category: category.trim() || editingEvent?.category || '',
        capacity: capacity ? Number(capacity) : (editingEvent?.capacity ?? null),
        ticketPrice: ticketPrice.trim() || editingEvent?.ticketPrice || '',
        registered: editingEvent?.registered ?? 0,
        status: editingEvent?.status || 'upcoming',
        description: description.trim(),
        sessions: sessions || [],
        ...(eligibilityData || {})
      };
      if (appContext.updateEvent) {
        appContext.updateEvent(targetId, updated);
      } else if (setEvents) {
        setEvents(prev => prev.map(e => e.id === targetId ? updated : e));
      }
      if (appContext.setSelectedEventId) {
        appContext.setSelectedEventId(targetId);
      }
      if (appContext.setEditingEvent) {
        appContext.setEditingEvent(null);
      }
      if (addToast) addToast(`Event "${updated.name}" updated successfully!`, 'success');
      if (onNavigate) {
        onNavigate('eventDetails');
      }
    } else {
      if (addToast) addToast('Draft saved!', 'success');
    }
  };

  const handleProceedToFormBuilder = ({
    eligibilityCriteria: ec,
    speakers: spk,
    sponsors: spn,
    photos: pht,
    documents: docs,
    organizer: org,
    volunteersNeeded: vn,
    volunteerRole: vr,
    volunteerOpenings: vo,
    contact: ct,
    faqs: fqs
  }) => {
    const newEv = {
      ...(editingEvent || {}),
      id: draftEventData?.id || (editingEvent ? editingEvent.id : 'ev-' + Date.now()),
      name: name.trim(),
      poster: coverImage || (editingEvent ? editingEvent.poster : null),
      originalPoster: originalCoverImage || coverImage,
      date: eventDate + (eventTime ? ' • ' + eventTime : ''),
      time: eventTime,
      location: location.trim(),
      category: category.trim() || editingEvent?.category || '',
      capacity: capacity ? Number(capacity) : (editingEvent?.capacity ?? null),
      ticketPrice: ticketPrice.trim() || editingEvent?.ticketPrice || '',
      registered: editingEvent?.registered ?? 0,
      status: editingEvent?.status || 'upcoming',
      description: description.trim(),
      speakers: spk && spk.length > 0 ? spk.map(s => s.name) : (speakers ? speakers.split(',').map(s => s.trim()).filter(Boolean) : (editingEvent?.speakers || [])),
      chiefGuests: spk || editingEvent?.chiefGuests || [],
      sponsors: spn || editingEvent?.sponsors || [],
      photos: pht || editingEvent?.photos || [],
      documents: docs || editingEvent?.documents || [],
      organizer: org?.name || organizerName.trim() || editingEvent?.organizer || '',
      organizedBy: org || editingEvent?.organizedBy || { name: organizerName.trim(), subtitle: organizerName.trim() },
      organizerData: org || editingEvent?.organizerData,
      volunteersNeeded: vn !== undefined ? vn : (editingEvent?.volunteersNeeded ?? false),
      volunteerRole: vr || editingEvent?.volunteerRole || '',
      volunteerOpenings: vo !== undefined ? vo : (editingEvent?.volunteerOpenings ?? 0),
      contact: ct || editingEvent?.contact,
      supportContact: [
        { id: 'email', label: 'Email', icon: 'mail', value: ct?.email || organizerEmail.trim() || editingEvent?.contact?.email || '' },
        { id: 'call', label: 'Call Organizer', icon: 'phone', value: ct?.phone || organizerPhone.trim() || editingEvent?.contact?.phone || '' },
        { id: 'help', label: 'Event Help Desk', icon: 'help', value: ct?.helpDesk || editingEvent?.contact?.helpDesk || '' }
      ],
      eligibilityCriteria: ec && ec.length > 0 ? ec : (editingEvent?.eligibilityCriteria || []),
      faqs: fqs || editingEvent?.faqs || [],
      sessions: sessions || editingEvent?.sessions || []
    };
    setDraftEventData(newEv);
    changeStep('formBuilder');
    if (addToast) addToast('Event details saved! Configure Registration Form.', 'info');
  };

  if (isStepLoading) {
    return <CreateEventSkeleton />;
  }

  // Step 3: Registration Form Builder
  if (currentStep === 'formBuilder' && draftEventData) {
    return (
      <EventRegistrationFormBuilder
        draftEvent={draftEventData}
        onPublishComplete={(fullEvent) => {
          if (editingEvent) {
            if (appContext.updateEvent) {
              appContext.updateEvent(editingEvent.id, fullEvent);
            } else if (setEvents) {
              setEvents(prev => prev.map(e => e.id === editingEvent.id ? fullEvent : e));
            }
            if (appContext.setSelectedEventId) {
              appContext.setSelectedEventId(editingEvent.id);
            }
            if (appContext.setEditingEvent) {
              appContext.setEditingEvent(null);
            }
            if (addToast) addToast(`Event "${fullEvent.name}" updated successfully!`, 'success');
            if (onNavigate) {
              onNavigate('eventDetails');
            }
          } else {
            if (appContext.addEvent) {
              appContext.addEvent(fullEvent);
            } else if (setEvents) {
              setEvents(prev => [fullEvent, ...prev]);
            }
            if (appContext.setSelectedEventId) {
              appContext.setSelectedEventId(fullEvent.id);
            }
            if (addToast) addToast('Event "' + fullEvent.name + '" published!', 'success');
            if (onNavigate) {
              onNavigate('events');
            }
          }
        }}
        onSaveDraft={(fullEvent) => {
          if (editingEvent) {
            if (appContext.updateEvent) {
              appContext.updateEvent(editingEvent.id, fullEvent);
            } else if (setEvents) {
              setEvents(prev => prev.map(e => e.id === editingEvent.id ? fullEvent : e));
            }
            if (appContext.setSelectedEventId) {
              appContext.setSelectedEventId(editingEvent.id);
            }
            if (appContext.setEditingEvent) {
              appContext.setEditingEvent(null);
            }
            if (addToast) addToast(`Event "${fullEvent.name}" draft updated!`, 'success');
            if (onNavigate) {
              onNavigate('eventDetails');
            }
          } else {
            if (addToast) addToast('Draft saved!', 'success');
          }
        }}
        onBackToDetails={() => changeStep('eligibility')}
        addToast={addToast}
      />
    );
  }

  // Step 2: Unified Eligibility, Speakers, Sponsors, Media, Organizers, Volunteers, Contacts & FAQs
  if (currentStep === 'eligibility') {
    return (
      <EventEligibilityScreen
        eventName={name}
        initialCriteria={draftEventData?.eligibilityCriteria || []}
        initialSpeakers={
          draftEventData?.chiefGuests ||
          (speakers
            ? speakers.split(',').map(s => s.trim()).filter(Boolean).map((s, idx) => ({
                id: `spk-${idx + 1}`,
                name: s,
                role: 'Speaker',
                initials: s.substring(0, 2).toUpperCase() || 'SP',
                verified: true
              }))
            : [])
        }
        initialSponsors={draftEventData?.sponsors || []}
        initialPhotos={draftEventData?.photos || []}
        initialDocuments={draftEventData?.documents || []}
        initialOrganizer={
          draftEventData?.organizerData ||
          (organizerName.trim()
            ? {
                initials: organizerName.trim().substring(0, 2).toUpperCase() || 'OR',
                name: organizerName.trim(),
                subtitle: 'Organizing Partner',
                verified: true
              }
            : null)
        }
        initialVolunteersNeeded={draftEventData?.volunteersNeeded ?? false}
        initialVolunteerRole={draftEventData?.volunteerRole || ''}
        initialVolunteerOpenings={draftEventData?.volunteerOpenings || 0}
        initialContact={
          draftEventData?.contact ||
          (organizerEmail.trim() || organizerPhone.trim()
            ? {
                email: organizerEmail.trim(),
                phone: organizerPhone.trim(),
                helpDesk: ''
              }
            : null)
        }
        initialFaqs={draftEventData?.faqs || []}
        onBack={() => changeStep('details')}
        onNext={handleProceedToFormBuilder}
        onSaveDraft={handleSaveEligibilityDraft}
        addToast={addToast}
      />
    );
  }

  // Dedicated Cover Crop Screen (Inside Sidebar & App Bar)
  if (showCropScreen && originalCoverImage) {
    return (
      <CoverCropScreen
        imageSrc={originalCoverImage}
        initialEventName={name}
        onApply={handleApplyCrop}
        onCancel={() => setShowCropScreen(false)}
        onUploadNew={handleCoverUpload}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section className="app-view active" id="viewCreateEvent" style={{ paddingBottom: 32, flex: 1 }}>

      {/* Top Header Row: Back button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <BackButton onClick={handleBack} />
        {editingEvent && (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6336EB', background: 'rgba(99, 54, 235, 0.08)', padding: '5px 14px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6336EB', display: 'inline-block' }}></span>
            Editing Event
          </span>
        )}
      </div>

      {/* Hero Banner */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 240,
          borderRadius: 20,
          overflow: 'hidden',
          background: coverImage ? '#0F172A' : (isDraggingCover ? '#F5F3FF' : '#F8FAFC'),
          border: coverImage ? '1px solid #E2E8F0' : (isDraggingCover ? '2px dashed #6336EB' : '2px dashed #CBD5E1'),
          boxShadow: coverImage ? '0 8px 32px rgba(15,23,42,0.15)' : 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none'
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
        onDragLeave={() => setIsDraggingCover(false)}
        onDrop={handleCoverDrop}
      >
        {/* Uploaded Photo Placed Here */}
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt="Event Cover"
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
            {/* Subtle bottom shadow overlay so text is readable over the photo */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.15) 55%, transparent 100%)', pointerEvents: 'none' }} />

            {/* Top-Right: Adjust Portion, Change Cover & Remove Photo */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {originalCoverImage && (
                <button
                  type="button"
                  onClick={() => setShowCropScreen(true)}
                  title="Edit cover crop portion"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(15, 23, 42, 0.82)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.28)',
                    color: '#FFF',
                    borderRadius: 20,
                    padding: '7px 15px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 54, 235, 0.95)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.82)'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Edit</span>
                </button>
              )}

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#FFF',
                  borderRadius: 20,
                  padding: '7px 16px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.82)'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span>Change Cover</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
              </label>

              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setOriginalCoverImage(null);
                }}
                title="Remove cover photo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  background: 'rgba(239, 68, 68, 0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#FFF',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 12,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.95)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.82)'}
              >
                ✕
              </button>
            </div>
          </>
        ) : (
          /* Center Upload Cover Button when NO photo is uploaded */
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              padding: '24px',
              width: '100%',
              height: '100%',
              zIndex: 5
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: '#EDE9FE',
                color: '#6336EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99, 54, 235, 0.15)',
                transition: 'transform 0.15s ease'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--knotnex-primary, #6336EB)',
                  color: '#FFFFFF',
                  borderRadius: 9999,
                  padding: '9px 24px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(99, 54, 235, 0.3)'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload Cover</span>
              </div>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginTop: 4 }}>
                Upload full photo &bull; Select portion for cover &bull; PNG, JPG or WebP
              </span>
            </div>

            <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
          </label>
        )}

        {/* Event name preview overlay in bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: ticketPrice.trim() ? 48 : 18,
            left: 22,
            right: 200,
            fontSize: coverImage ? 26 : 18,
            fontWeight: coverImage ? 900 : 700,
            color: coverImage ? '#FFF' : '#334155',
            textShadow: coverImage ? '0 2px 10px rgba(0,0,0,0.7)' : 'none',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            pointerEvents: 'none',
            zIndex: 6
          }}
        >
          {name || (
            <span style={{ opacity: coverImage ? 0.6 : 0.45, fontSize: 16, fontWeight: 600, color: coverImage ? '#FFF' : '#64748B' }}>
              Your Event Name
            </span>
          )}
        </div>

        {/* Rate badge - only show if admin entered/set a price */}
        {ticketPrice.trim() ? (
          <div style={{ position: 'absolute', bottom: 18, left: 22, display: 'flex', alignItems: 'center', gap: 6, background: '#6336EB', color: '#FFF', borderRadius: 20, padding: '4px 12px', fontSize: 11.5, fontWeight: 700, zIndex: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
            {ticketPrice}
          </div>
        ) : null}
      </div>

      {/* Content Card */}
      <div style={{ background: '#FFF', borderRadius: '0 0 20px 20px', border: '1px solid #E2E8F0', borderTop: 'none', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

        {/* Editable Event Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #F1F5F9', paddingBottom: 16 }}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Event Name / Title"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 22, fontWeight: 800, color: '#1E1B4B', background: 'transparent', letterSpacing: '-0.02em' }} />
          <div style={{ color: '#6336EB', flexShrink: 0 }}><PencilIcon size={16} /></div>
        </div>

        {/* Date / Time / Location / Category / Price / Capacity chips with ample spacing */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
          <GoogleCalendarDatePicker value={eventDate} onChange={setEventDate} />
          <ClockTimePicker value={eventTime} onChange={setEventTime} />
          <CitySearchLocationPicker value={location} onChange={setLocation} />

          {/* Category Chip */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#F8F9FB',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 500,
            color: '#1E1B4B'
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span style={{ color: '#64748B', fontSize: 12 }}>Category:</span>
            <select
              value={category || ''}
              onChange={e => setCategory(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                fontWeight: 600,
                color: category ? '#1E1B4B' : '#64748B',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Environment">Environment</option>
              <option value="Community">Community</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Ticket Price Chip */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#F8F9FB',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 500,
            color: '#1E1B4B'
          }}>
            <span style={{ color: '#6336EB', fontWeight: 700, fontSize: 14 }}>₹</span>
            <span style={{ color: '#64748B', fontSize: 12 }}>Price:</span>
            <input
              type="text"
              value={ticketPrice}
              onChange={e => setTicketPrice(e.target.value)}
              placeholder="e.g. ₹550 or Free"
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                fontWeight: 600,
                color: '#1E1B4B',
                width: 90
              }}
            />
            <PencilIcon size={12} />
          </div>
        </div>

        {/* About the Event */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#6336EB' }}>About the Event</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6336EB', fontSize: 13, fontWeight: 600 }}>
              <PencilIcon size={13} /> Edit Details
            </span>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Describe your event — what attendees can expect, who it's for, highlights, themes..." rows={4}
            style={{ width: '100%', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: '12px 14px', fontSize: 13.5, color: '#334155', lineHeight: 1.65, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#FAFAFA' }} />
        </div>

        {/* Event Schedule (Inline Timeline, NO Popups, NO Icons) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#6336EB' }}>Event Schedule</span>
            {!isAddingSession && !editingSessionId && sessions.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddingSession(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6336EB',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                + Add Session
              </button>
            )}
          </div>

          {sessions.length === 0 && !isAddingSession ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 20px',
              background: '#FAFAFC',
              borderRadius: 14,
              border: '1.5px dashed #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B', marginBottom: 4 }}>
                No sessions scheduled yet
              </div>
              <div style={{ fontSize: 12.5, color: '#64748B', marginBottom: 16 }}>
                Build your event timeline with keynotes, workshops, and breaks directly here.
              </div>
              <button
                type="button"
                onClick={() => setIsAddingSession(true)}
                style={{
                  background: '#6336EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 24px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(99, 54, 235, 0.25)',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                + Add Session
              </button>
            </div>
          ) : (
            <div>
              {sessions.map(s => {
                if (editingSessionId === s.id) {
                  return (
                    <SessionComposer
                      key={s.id}
                      initial={s}
                      defaultDate={eventDate}
                      onSave={handleSaveSession}
                      onCancel={handleCancelSession}
                    />
                  );
                }
                return (
                  <SessionItem
                    key={s.id}
                    session={s}
                    onEdit={handleStartEditSession}
                    onDelete={handleDeleteSession}
                  />
                );
              })}

              {/* Inline composer for new session */}
              {isAddingSession && (
                <SessionComposer
                  defaultDate={eventDate}
                  onSave={handleSaveSession}
                  onCancel={handleCancelSession}
                />
              )}

              {/* Add Session button at bottom of list */}
              {!isAddingSession && !editingSessionId && sessions.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingSession(true)}
                    style={{
                      background: 'rgba(99, 54, 235, 0.08)',
                      color: '#6336EB',
                      border: '1.5px dashed #6336EB',
                      borderRadius: 8,
                      padding: '8px 24px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6336EB'; e.currentTarget.style.color = '#FFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99, 54, 235, 0.08)'; e.currentTarget.style.color = '#6336EB'; }}
                  >
                    + Add Session
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </section>

      {/* Sticky Bottom Bar: Save Draft on left, Small Next Button on right */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #E2E8F0',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        boxSizing: 'border-box'
      }}>
        <button type="button" onClick={handleSaveDraft}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 20px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#FFF', fontSize: 13, fontWeight: 600, color: '#1E1B4B', cursor: 'pointer', transition: 'all 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#6336EB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Draft
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {editingEvent && (
            <button
              type="button"
              onClick={handleDirectUpdate}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 40,
                padding: '0 20px',
                borderRadius: 10,
                border: '1.5px solid #6336EB',
                background: '#FFF',
                color: '#6336EB',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99, 54, 235, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Save Changes
            </button>
          )}
          <button type="button" onClick={handleProceedToEligibility}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, padding: '0 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6336EB, #4D25C9)', color: '#FFF', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,54,235,0.25)', transition: 'all 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Next: Eligibility Criteria
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
