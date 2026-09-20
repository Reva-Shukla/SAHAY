export interface StateDistrictMapping {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMapping[] = [
  // 28 Indian States
  {
    state: "Andhra Pradesh",
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Kakinada", "Anantapur", "Rajahmundry"]
  },
  {
    state: "Arunachal Pradesh",
    districts: ["Itanagar", "Tawang", "Naharlagun", "Pasighat", "Ziro", "Bomdila"]
  },
  {
    state: "Assam",
    districts: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia"]
  },
  {
    state: "Bihar",
    districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Begusarai"]
  },
  {
    state: "Chhattisgarh",
    districts: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"]
  },
  {
    state: "Goa",
    districts: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"]
  },
  {
    state: "Gujarat",
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"]
  },
  {
    state: "Haryana",
    districts: ["Rewari", "Gurgaon", "Ambala", "Faridabad", "Hisar", "Rohtak", "Panipat", "Karnal", "Sonipat", "Panchkula"]
  },
  {
    state: "Himachal Pradesh",
    districts: ["Shimla", "Dharamshala", "Manali", "Mandi", "Solan", "Kullu", "Hamirpur"]
  },
  {
    state: "Jharkhand",
    districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"]
  },
  {
    state: "Karnataka",
    districts: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Tumakuru", "Udupi", "Davangere"]
  },
  {
    state: "Kerala",
    districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kottayam"]
  },
  {
    state: "Madhya Pradesh",
    districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna"]
  },
  {
    state: "Maharashtra",
    districts: ["Mumbai City", "Pune", "Nagpur", "Nashik", "Thane", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur", "Amravati"]
  },
  {
    state: "Manipur",
    districts: ["Imphal", "Churachandpur", "Thoubal", "Ukhrul", "Bishnupur"]
  },
  {
    state: "Meghalaya",
    districts: ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar"]
  },
  {
    state: "Mizoram",
    districts: ["Aizawl", "Lunglei", "Champhai", "Serchhip"]
  },
  {
    state: "Nagaland",
    districts: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"]
  },
  {
    state: "Odisha",
    districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"]
  },
  {
    state: "Punjab",
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"]
  },
  {
    state: "Rajasthan",
    districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar"]
  },
  {
    state: "Sikkim",
    districts: ["Gangtok", "Namchi", "Geyzing", "Mangan"]
  },
  {
    state: "Tamil Nadu",
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"]
  },
  {
    state: "Telangana",
    districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar"]
  },
  {
    state: "Tripura",
    districts: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"]
  },
  {
    state: "Uttar Pradesh",
    districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Prayagraj", "Ghaziabad", "Meerut", "Gorakhpur", "Bareilly"]
  },
  {
    state: "Uttarakhand",
    districts: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Nainital", "Rishikesh"]
  },
  {
    state: "West Bengal",
    districts: ["Kolkata", "Howrah", "Darjeeling", "North 24 Parganas", "Hooghly", "Siliguri", "Asansol"]
  },
  // 8 Union Territories
  {
    state: "Andaman and Nicobar Islands",
    districts: ["Port Blair", "Car Nicobar", "Mayabunder"]
  },
  {
    state: "Chandigarh",
    districts: ["Chandigarh Central", "Manimajra", "Sector 17"]
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    districts: ["Daman", "Diu", "Silvassa"]
  },
  {
    state: "Delhi (NCT)",
    districts: ["South Delhi", "Central Delhi", "North West Delhi", "East Delhi", "Dwarka", "New Delhi", "West Delhi"]
  },
  {
    state: "Jammu and Kashmir",
    districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua"]
  },
  {
    state: "Ladakh",
    districts: ["Leh", "Kargil"]
  },
  {
    state: "Lakshadweep",
    districts: ["Kavaratti", "Agatti", "Amini"]
  },
  {
    state: "Puducherry",
    districts: ["Puducherry", "Karaikal", "Mahe", "Yanam"]
  }
];

export const getStateDistricts = (stateName: string): string[] => {
  const match = INDIAN_STATES_DISTRICTS.find(s => s.state === stateName);
  return match ? match.districts : [];
};
