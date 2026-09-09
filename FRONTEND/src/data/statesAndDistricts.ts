export interface StateDistrictMapping {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMapping[] = [
  {
    state: "Haryana",
    districts: ["Rewari", "Gurgaon", "Ambala", "Faridabad", "Hisar", "Rohtak", "Panipat"]
  },
  {
    state: "Maharashtra",
    districts: ["Pune", "Mumbai City", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur"]
  },
  {
    state: "Karnataka",
    districts: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Tumakuru"]
  },
  {
    state: "Delhi NCR",
    districts: ["South Delhi", "Central Delhi", "North West Delhi", "East Delhi", "Dwarka"]
  },
  {
    state: "Tamil Nadu",
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
  },
  {
    state: "West Bengal",
    districts: ["Kolkata", "Howrah", "Darjeeling", "North 24 Parganas", "Hooghly"]
  }
];

export const getStateDistricts = (stateName: string): string[] => {
  const match = INDIAN_STATES_DISTRICTS.find(s => s.state === stateName);
  return match ? match.districts : [];
};
