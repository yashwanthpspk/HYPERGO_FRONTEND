import React from "react";
import { 
  Input, 
  Button, 
  Textarea, 
  Select, 
  SelectItem,
  Checkbox,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Property } from "../types/property";

interface EditPropertyProps {
  property: Property;
  onSave: (updatedProperty: Property) => void;
}

export const EditProperty = ({ property, onSave }: EditPropertyProps) => {
  const [formData, setFormData] = React.useState({
    ...property,
    amenitiesArray: property.amenities ? property.amenities.split('|') : [],
    tagsArray: property.tags ? property.tags.split('|') : []
  });
  
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "penthouse", label: "Penthouse" },
    { value: "bungalow", label: "Bungalow" },
    { value: "studio", label: "Studio" },
    { value: "condo", label: "Condominium" },
    { value: "townhouse", label: "Townhouse" }
  ];
  
  const furnishedOptions = [
    { value: "Furnished", label: "Furnished" },
    { value: "Semi", label: "Semi-Furnished" },
    { value: "Unfurnished", label: "Unfurnished" }
  ];
  
  const listingTypes = [
    { value: "rent", label: "For Rent" },
    { value: "sale", label: "For Sale" }
  ];
  
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        amenitiesArray: [...prev.amenitiesArray, amenity]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amenitiesArray: prev.amenitiesArray.filter(a => a !== amenity)
      }));
    }
  };
  
  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        tagsArray: [...prev.tagsArray, tag]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tagsArray: prev.tagsArray.filter(t => t !== tag)
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProperty = {
      ...formData,
      amenities: formData.amenitiesArray.join('|'),
      tags: formData.tagsArray.join('|')
    };
    
    delete updatedProperty.amenitiesArray;
    delete updatedProperty.tagsArray;
    
    onSave(updatedProperty as Property);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Property Title"
          placeholder="Enter property title"
          value={formData.title}
          onValueChange={(value) => handleInputChange("title", value)}
          isRequired
        />
        
        <Input
          label="Price (₹)"
          placeholder="Enter price"
          type="number"
          min="0"
          value={formData.price.toString()}
          onValueChange={(value) => handleInputChange("price", Number(value))}
          startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">₹</span></div>}
          isRequired
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Property Type"
          placeholder="Select property type"
          selectedKeys={[formData.type.toLowerCase()]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            handleInputChange("type", selected);
          }}
          isRequired
        >
          {propertyTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
        
        <Input
          label="Bedrooms"
          placeholder="Number of bedrooms"
          type="number"
          min="0"
          value={formData.bedrooms.toString()}
          onValueChange={(value) => handleInputChange("bedrooms", Number(value))}
        />
        
        <Input
          label="Bathrooms"
          placeholder="Number of bathrooms"
          type="number"
          min="0"
          value={formData.bathrooms.toString()}
          onValueChange={(value) => handleInputChange("bathrooms", Number(value))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Area (sq ft)"
          placeholder="Property area"
          type="number"
          min="0"
          value={formData.areaSqFt ? formData.areaSqFt.toString() : ""}
          onValueChange={(value) => handleInputChange("areaSqFt", Number(value))}
          endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">sq ft</span></div>}
        />
        
        <Input
          label="City"
          placeholder="City"
          value={formData.city || ""}
          onValueChange={(value) => handleInputChange("city", value)}
          isRequired
        />
        
        <Input
          label="State"
          placeholder="State"
          value={formData.state || ""}
          onValueChange={(value) => handleInputChange("state", value)}
          isRequired
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Furnished Status"
          placeholder="Select furnished status"
          selectedKeys={[formData.furnished || "Unfurnished"]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            handleInputChange("furnished", selected);
          }}
        >
          {furnishedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        
        <Input
          label="Available From"
          placeholder="YYYY-MM-DD"
          type="date"
          value={formData.availableFrom || ""}
          onChange={(e) => handleInputChange("availableFrom", e.target.value)}
        />
        
        <Input
          label="Listed By"
          placeholder="Owner/Agent/Builder"
          value={formData.listedBy || ""}
          onValueChange={(value) => handleInputChange("listedBy", value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Listing Type"
          placeholder="Select listing type"
          selectedKeys={[formData.listingType || "sale"]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            handleInputChange("listingType", selected);
          }}
        >
          {listingTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
        
        <Input
          label="Rating"
          placeholder="Property rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={formData.rating?.toString() || ""}
          onValueChange={(value) => handleInputChange("rating", Number(value))}
        />
        
        <Input
          label="Color Theme"
          placeholder="Hex color code"
          value={formData.colorTheme || ""}
          onValueChange={(value) => handleInputChange("colorTheme", value)}
          startContent={
            formData.colorTheme ? 
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.colorTheme }}></div> : 
              null
          }
        />
      </div>
      
      <Checkbox
        isSelected={formData.isVerified || false}
        onValueChange={(checked) => handleInputChange("isVerified", checked)}
      >
        Verified Property
      </Checkbox>
      
      <Textarea
        label="Description"
        placeholder="Enter property description"
        value={formData.description || ""}
        onValueChange={(value) => handleInputChange("description", value)}
        minRows={3}
      />
      
      <div>
        <p className="text-small font-medium mb-3">Property Amenities</p>
        <Divider className="mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {["parking", "garden", "pool", "security", "gym", "wifi", "power-backup", "lift", "clubhouse"].map((amenity) => (
            <Checkbox
              key={amenity}
              isSelected={formData.amenitiesArray.includes(amenity)}
              onValueChange={(checked) => handleAmenityChange(amenity, checked)}
            >
              {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/-/g, ' ')}
            </Checkbox>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-small font-medium mb-3">Property Tags</p>
        <Divider className="mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {["gated-community", "corner-plot", "sea-view", "lake-view", "near-metro", "luxury", "affordable", "family-friendly"].map((tag) => (
            <Checkbox
              key={tag}
              isSelected={formData.tagsArray.includes(tag)}
              onValueChange={(checked) => handleTagChange(tag, checked)}
            >
              {tag.replace(/-/g, ' ')}
            </Checkbox>
          ))}
        </div>
      </div>
    </form>
  );
};