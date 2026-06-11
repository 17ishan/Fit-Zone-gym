import { useState } from "react";
import { X } from "lucide-react";

interface CustomerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (customerData: CustomerData) => void;
    planName: string;
    planPrice: string;
}

export interface CustomerData {
    name: string;
    email: string;
    phone: string;
    address: string;
    age: string;
}

export default function CustomerDetailsModal({
    isOpen,
    onClose,
    onSubmit,
    planName,
    planPrice,
}: CustomerDetailsModalProps) {
    const [formData, setFormData] = useState<CustomerData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        age: "",
    });

    const [errors, setErrors] = useState<Partial<CustomerData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof CustomerData]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CustomerData> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.age.trim()) {
            newErrors.age = "Age is required";
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 16 || Number(formData.age) > 100) {
            newErrors.age = "Age must be between 16 and 100";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#FFFADC]">
                            Join <span className="text-[#FF0000]">{planName}</span> Plan
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{planPrice}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#FF0000] transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-[#FFFADC] font-semibold mb-2">
                            Full Name <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.name ? "border-red-500" : "border-gray-700"
                                } rounded-lg px-4 py-3 text-[#FFFADC] focus:outline-none focus:border-[#FF0000] transition-colors`}
                            placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-[#FFFADC] font-semibold mb-2">
                            Email Address <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.email ? "border-red-500" : "border-gray-700"
                                } rounded-lg px-4 py-3 text-[#FFFADC] focus:outline-none focus:border-[#FF0000] transition-colors`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-[#FFFADC] font-semibold mb-2">
                            Phone Number <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.phone ? "border-red-500" : "border-gray-700"
                                } rounded-lg px-4 py-3 text-[#FFFADC] focus:outline-none focus:border-[#FF0000] transition-colors`}
                            placeholder="10-digit phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Age */}
                    <div>
                        <label htmlFor="age" className="block text-[#FFFADC] font-semibold mb-2">
                            Age <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.age ? "border-red-500" : "border-gray-700"
                                } rounded-lg px-4 py-3 text-[#FFFADC] focus:outline-none focus:border-[#FF0000] transition-colors`}
                            placeholder="Your age"
                            min="16"
                            max="100"
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-[#FFFADC] font-semibold mb-2">
                            Address <span className="text-[#FF0000]">*</span>
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full bg-black/50 border ${errors.address ? "border-red-500" : "border-gray-700"
                                } rounded-lg px-4 py-3 text-[#FFFADC] focus:outline-none focus:border-[#FF0000] transition-colors resize-none`}
                            placeholder="Enter your full address"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-[#FFFADC] py-3 rounded-lg transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#FF0000] hover:bg-[#AF0404] text-[#FFFADC] py-3 rounded-lg transition-colors font-semibold"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
