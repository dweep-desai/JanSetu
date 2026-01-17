import { useState } from 'react';
import { Video, Calendar, Clock, Stethoscope } from 'lucide-react';

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    experience: string;
    rating: number;
    availableSlots: string[];
}

const ESanjeevani = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedSlot, setSelectedSlot] = useState('');

    const doctors: Doctor[] = [
        { id: '1', name: 'Dr. Priya Sharma', specialization: 'General Physician', experience: '10 years', rating: 4.8, availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
        { id: '2', name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', experience: '15 years', rating: 4.9, availableSlots: ['9:00 AM', '10:00 AM', '4:00 PM', '5:00 PM'] },
        { id: '3', name: 'Dr. Anjali Patel', specialization: 'Pediatrician', experience: '8 years', rating: 4.7, availableSlots: ['11:00 AM', '12:00 PM', '3:00 PM'] },
        { id: '4', name: 'Dr. Mohan Singh', specialization: 'Dermatologist', experience: '12 years', rating: 4.6, availableSlots: ['10:00 AM', '1:00 PM', '4:00 PM'] },
    ];

    const handleBookAppointment = () => {
        if (selectedDoctor && selectedSlot && selectedDate) {
            alert(`Appointment booked!\nDoctor: ${selectedDoctor.name}\nDate: ${selectedDate}\nTime: ${selectedSlot}`);
            setSelectedDoctor(null);
            setSelectedSlot('');
            setSelectedDate('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">e-Sanjeevani</h1>
                <p className="text-gray-600">Telemedicine services - Consult doctors online</p>
            </div>

            {!selectedDoctor ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Available Doctors</h2>
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Stethoscope className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{doctor.name}</h3>
                                        <p className="text-gray-600 mb-1">{doctor.specialization}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{doctor.experience} experience</span>
                                            <span className="flex items-center gap-1">
                                                ⭐ {doctor.rating}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Available Slots:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.availableSlots.map((slot, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setSelectedDoctor(null);
                                setSelectedSlot('');
                                setSelectedDate('');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                        >
                            ← Back to Doctors
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Book Appointment with {selectedDoctor.name}</h2>
                        <p className="text-gray-600">{selectedDoctor.specialization}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Select Time Slot
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {selectedDoctor.availableSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${selectedSlot === slot
                                                ? 'bg-teal-600 text-white border-teal-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Video className="w-5 h-5 text-teal-600 mt-0.5" />
                                <div className="text-sm text-teal-800">
                                    <p className="font-medium mb-1">Video Consultation</p>
                                    <p>You will receive a video call link via SMS/Email before your appointment time.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedSlot}
                            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ESanjeevani;
