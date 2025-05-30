import React from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Textarea, 
  Select, 
  SelectItem,
  Checkbox,
  Divider
} from "@hypergo/react";
import { Icon } from "@iconify/react";
import { addToast } from "@hypergo/react";

export const AddProperty = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    price: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
    status: "available",
    features: {
      parking: false,
      garden: false,
      pool: false,
      security: false,
      airConditioning: false,
      furnished: false
    }
  });
  
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condominium" },
    { value: "townhouse", label: "Townhouse" },
    { value: "villa", label: "Villa" },
    { value: "land", label: "Land" }
  ];
  
  const propertyStatus = [
    { value: "available", label: "Available" },
    { value: "pending", label: "Pending" },
    { value: "sold", label: "Sold" }
  ];
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.price || !formData.type || !formData.location) {
      addToast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        severity: "danger"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      addToast({
        title: "Success",
        description: "Property has been added successfully",
        severity: "success"
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        location: "",
        status: "available",
        features: {
          parking: false,
          garden: false,
          pool: false,
          security: false,
          airConditioning: false,
          furnished: false
        }
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold mb-6">Add New Property</h2>
          
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
                label="Price ($)"
                placeholder="Enter price"
                type="number"
                min="0"
                value={formData.price}
                onValueChange={(value) => handleInputChange("price", value)}
                startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                isRequired
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Property Type"
                placeholder="Select property type"
                selectedKeys={formData.type ? [formData.type] : []}
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
                value={formData.bedrooms}
                onValueChange={(value) => handleInputChange("bedrooms", value)}
              />
              
              <Input
                label="Bathrooms"
                placeholder="Number of bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onValueChange={(value) => handleInputChange("bathrooms", value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Area (sq ft)"
                placeholder="Property area"
                type="number"
                min="0"
                value={formData.area}
                onValueChange={(value) => handleInputChange("area", value)}
                endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">sq ft</span></div>}
              />
              
              <Input
                label="Location"
                placeholder="City, State"
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
                isRequired
              />
            </div>
            
            <Select
              label="Status"
              placeholder="Select property status"
              selectedKeys={[formData.status]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleInputChange("status", selected);
              }}
            >
              {propertyStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
            
            <Textarea
              label="Description"
              placeholder="Enter property description"
              value={formData.description}
              onValueChange={(value) => handleInputChange("description", value)}
              minRows={3}
            />
            
            <div>
              <p className="text-small font-medium mb-3">Property Features</p>
              <Divider className="mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Checkbox
                  isSelected={formData.features.parking}
                  onValueChange={(checked) => handleFeatureChange("parking", checked)}
                >
                  Parking
                </Checkbox>
                <Checkbox
                  isSelected={formData.features.garden}
                  onValueChange={(checked) => handleFeatureChange("garden", checked)}
                >
                  Garden
                </Checkbox>
                <Checkbox
                  isSelected={formData.features.pool}
                  onValueChange={(checked) => handleFeatureChange("pool", checked)}
                >
                  Swimming Pool
                </Checkbox>
                <Checkbox
                  isSelected={formData.features.security}
                  onValueChange={(checked) => handleFeatureChange("security", checked)}
                >
                  Security System
                </Checkbox>
                <Checkbox
                  isSelected={formData.features.airConditioning}
                  onValueChange={(checked) => handleFeatureChange("airConditioning", checked)}
                >
                  Air Conditioning
                </Checkbox>
                <Checkbox
                  isSelected={formData.features.furnished}
                  onValueChange={(checked) => handleFeatureChange("furnished", checked)}
                >
                  Furnished
                </Checkbox>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="flat"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                startContent={!isSubmitting && <Icon icon="lucide:save" />}
              >
                Save Property
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};