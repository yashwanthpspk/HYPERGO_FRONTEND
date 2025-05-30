import React from "react";
import { Card, CardBody, CardHeader, Divider, Select, SelectItem } from "@heroui/react";
import { Property } from "../types/property";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface PropertyAnalyticsProps {
  properties: Property[];
}

export const PropertyAnalytics = ({ properties }: PropertyAnalyticsProps) => {
  const [chartView, setChartView] = React.useState<string>("propertyType");

  // Property type distribution data
  const propertyTypeData = React.useMemo(() => {
    const typeCounts: Record<string, number> = {};
    properties.forEach(property => {
      typeCounts[property.type] = (typeCounts[property.type] || 0) + 1;
    });
    
    return Object.keys(typeCounts).map(type => ({
      name: type,
      count: typeCounts[type]
    }));
  }, [properties]);

  // Price range distribution data
  const priceRangeData = React.useMemo(() => {
    const ranges = [
      { range: "0-5M", min: 0, max: 5000000, count: 0 },
      { range: "5M-10M", min: 5000000, max: 10000000, count: 0 },
      { range: "10M-20M", min: 10000000, max: 20000000, count: 0 },
      { range: "20M-30M", min: 20000000, max: 30000000, count: 0 },
      { range: "30M-40M", min: 30000000, max: 40000000, count: 0 },
      { range: "40M+", min: 40000000, max: Infinity, count: 0 }
    ];
    
    properties.forEach(property => {
      const range = ranges.find(r => property.price >= r.min && property.price < r.max);
      if (range) {
        range.count++;
      }
    });
    
    return ranges;
  }, [properties]);

  // Listing type distribution data
  const listingTypeData = React.useMemo(() => {
    const rentCount = properties.filter(p => p.listingType === "rent").length;
    const saleCount = properties.filter(p => p.listingType === "sale").length;
    
    return [
      { name: "For Rent", value: rentCount },
      { name: "For Sale", value: saleCount }
    ];
  }, [properties]);

  // City distribution data
  const cityData = React.useMemo(() => {
    const cityCounts: Record<string, number> = {};
    properties.forEach(property => {
      if (property.city) {
        cityCounts[property.city] = (cityCounts[property.city] || 0) + 1;
      }
    });
    
    return Object.keys(cityCounts)
      .map(city => ({
        name: city,
        count: cityCounts[city]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 cities
  }, [properties]);

  // Bedroom distribution data
  const bedroomData = React.useMemo(() => {
    const bedroomCounts: Record<number, number> = {};
    properties.forEach(property => {
      bedroomCounts[property.bedrooms] = (bedroomCounts[property.bedrooms] || 0) + 1;
    });
    
    return Object.keys(bedroomCounts)
      .map(bedrooms => ({
        name: `${bedrooms} BHK`,
        count: bedroomCounts[Number(bedrooms)]
      }))
      .sort((a, b) => Number(a.name.split(' ')[0]) - Number(b.name.split(' ')[0]));
  }, [properties]);

  // Rating distribution data
  const ratingData = React.useMemo(() => {
    const ratingCounts: Record<string, number> = {
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0
    };
    
    properties.forEach(property => {
      if (property.rating) {
        if (property.rating >= 1 && property.rating < 2) ratingCounts["1-2"]++;
        else if (property.rating >= 2 && property.rating < 3) ratingCounts["2-3"]++;
        else if (property.rating >= 3 && property.rating < 4) ratingCounts["3-4"]++;
        else if (property.rating >= 4 && property.rating <= 5) ratingCounts["4-5"]++;
      }
    });
    
    return Object.keys(ratingCounts).map(range => ({
      name: `${range} Stars`,
      count: ratingCounts[range]
    }));
  }, [properties]);

  // Amenities distribution data
  const amenitiesData = React.useMemo(() => {
    const amenityCounts: Record<string, number> = {};
    
    properties.forEach(property => {
      if (property.amenities) {
        const amenities = property.amenities.split('|');
        amenities.forEach(amenity => {
          amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
        });
      }
    });
    
    return Object.keys(amenityCounts)
      .map(amenity => ({
        name: amenity,
        count: amenityCounts[amenity]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 amenities
  }, [properties]);

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  const renderChart = () => {
    switch (chartView) {
      case "propertyType":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={propertyTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Properties" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "priceRange":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={priceRangeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Number of Properties" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "listingType":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={listingTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {listingTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "city":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" name="Number of Properties" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "bedrooms":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={bedroomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff8042" name="Number of Properties" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "rating":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Number of Properties" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "amenities":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={amenitiesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8dd1e1" name="Number of Properties" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Property Analytics</h3>
            <Select
              label="Chart View"
              className="w-64"
              selectedKeys={[chartView]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setChartView(selected);
              }}
            >
              <SelectItem key="propertyType" value="propertyType">Property Type Distribution</SelectItem>
              <SelectItem key="priceRange" value="priceRange">Price Range Distribution</SelectItem>
              <SelectItem key="listingType" value="listingType">Listing Type Distribution</SelectItem>
              <SelectItem key="city" value="city">City Distribution</SelectItem>
              <SelectItem key="bedrooms" value="bedrooms">Bedroom Distribution</SelectItem>
              <SelectItem key="rating" value="rating">Rating Distribution</SelectItem>
              <SelectItem key="amenities" value="amenities">Top Amenities</SelectItem>
            </Select>
          </div>
          <p className="text-default-500">Analyzing {properties.length} properties</p>
        </CardHeader>
        <Divider />
        <CardBody>
          {renderChart()}
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Property Summary</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Properties:</span>
                <span className="font-semibold">{properties.length}</span>
              </div>
              <div className="flex justify-between">
                <span>For Sale:</span>
                <span className="font-semibold">{properties.filter(p => p.listingType === "sale").length}</span>
              </div>
              <div className="flex justify-between">
                <span>For Rent:</span>
                <span className="font-semibold">{properties.filter(p => p.listingType === "rent").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Properties:</span>
                <span className="font-semibold">{properties.filter(p => p.isVerified).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Price:</span>
                <span className="font-semibold">
                  ₹{(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Rating:</span>
                <span className="font-semibold">
                  {(properties.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / 
                    properties.filter(p => p.rating).length).toFixed(1)}⭐
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Property Insights</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Most Common Property Type:</span>
                <span className="font-semibold">
                  {propertyTypeData.sort((a, b) => b.count - a.count)[0]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most Common City:</span>
                <span className="font-semibold">
                  {cityData[0]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most Common Bedroom Count:</span>
                <span className="font-semibold">
                  {bedroomData.sort((a, b) => b.count - a.count)[0]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Top Amenity:</span>
                <span className="font-semibold">
                  {amenitiesData[0]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Highest Priced Property:</span>
                <span className="font-semibold">
                  ₹{Math.max(...properties.map(p => p.price)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lowest Priced Property:</span>
                <span className="font-semibold">
                  ₹{Math.min(...properties.map(p => p.price)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};