import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://wwxlvnmsueppjrtkhqdv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eGx2bm1zdWVwcGpydGtocWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNDk3NjYsImV4cCI6MjAyNzYyNTc2Nn0._7cfgLV7yV4-bWYsGqv59mcG52fbj0tr6Q4eoVNuNc0";
const supabase = createClient(supabaseUrl, supabaseKey);

const DModeButton = document.getElementById("DarkModeButton");
DModeButton.addEventListener("click", DModeToggle);

function DModeToggle()
{
    //Function alters values in the CSS, so need a reference to it.
    let doc = document.querySelector(":root");
    let docStyle = getComputedStyle(doc);
    let currLDMode = docStyle.getPropertyValue("--LD");
    if(currLDMode === "L")
    {
        doc.style.setProperty("--backgroundColor", "navy");
        doc.style.setProperty("--textColor", "grey");
        doc.style.setProperty("--boxBackgroundColor", "black");
        doc.style.setProperty("--boxBorderColor", "grey");
        doc.style.setProperty("--LD", "D");
    }
    else //Site defaults to light mode
    {
        doc.style.setProperty("--backgroundColor", "aliceBlue");
        doc.style.setProperty("--textColor", "white");
        doc.style.setProperty("--boxBackgroundColor", "blue");
        doc.style.setProperty("--boxBorderColor", "lightblue");
        doc.style.setProperty("--LD", "L");
    }
}

function ClearResponses()
{
    let prevSearchResults = document.getElementsByClassName('SearchResult');
    
    while(prevSearchResults[0])
    {
        prevSearchResults[0].parentNode.removeChild(prevSearchResults[0]);
    }
}

function ShowResponses(text)
{
    let paragraph = document.createElement("div");
    let section = document.getElementById("results");
    paragraph.classList.add("SearchResult");
    //Dynamically-created element, so will be easier to define its CSS properties here.
    paragraph.setAttribute('style', 'white-space: pre;'); 
    paragraph.textContent = text;
    section.appendChild(paragraph);  
}

const NameBox = document.getElementById("name");
const LicenseBox = document.getElementById("license");
const PeopleSearchButton = document.getElementById("PeopleSearchButton");
const outputMessage = document.getElementById("message");
if(PeopleSearchButton)
{
    PeopleSearchButton.addEventListener("click", SearchForPerson);  

}

function SearchForPerson() 
{
    let input;
    let nameOrLicense = -1;
    if(!NameBox.value && !LicenseBox.value)
    {
        outputMessage.textContent = "Error";
        return;
    }
    else if(NameBox.value && LicenseBox.value)
    {
        outputMessage.textContent = "Error";
        return;
    }
    else if(NameBox.value)
    {
        input = NameBox.value;
        nameOrLicense = 1;
    }
    else if(LicenseBox.value)
    {
        input = LicenseBox.value;
        nameOrLicense = 2
    }
    if(input)
    {
        let people;
        let dbResult;
        if(nameOrLicense === 1)
        {
            dbResult = GetPeopleByName(input);
        }
        else if(nameOrLicense === 2)
        {
            dbResult = GetPeopleByLicense(input);
        }
        else
        {
            outputMessage.textContent = "Error";
            return;
        }
        dbResult.then((data, error) =>
        {
            if(!error && data)
            {
                
                ClearResponses();
                people = data

                for(let i = 0; i < people.length; i++)
                {
                    ShowResponses(`Name: ${people[i].Name}\r\nAddress: ${people[i].Address}\r\nDOB: ${people[i].DOB}\r\nLicense Number: ${people[i].LicenseNumber}\r\nExpiry Date: ${people[i].ExpiryDate}\r\n\r\n`);
                }

                if(people.length === 0)
                {
                    outputMessage.textContent = "No result found";
                }
                else
                {
                    outputMessage.textContent = "Search successful";
                }  
            }
            else
            {
                ShowResponses("There was an error accessing the database.\r\n");
            }
        });
        
    }
}

async function GetPeopleByName(input)
{
    const { data, error } = await supabase.from("People").select("*").ilike("Name",`%${input}%`);
    return data;
}
async function GetPeopleByLicense(input)
{
    const { data, error } = await supabase.from("People").select("*").ilike("LicenseNumber",`%${input}%`);
    return data;
}

const RegistrationBox = document.getElementById("rego");
const VehicleSearchButton = document.getElementById("VehicleSearchButton");
if(VehicleSearchButton)
{
    VehicleSearchButton.addEventListener("click", SearchForVehicle);
}

function SearchForVehicle() 
{
    let input = RegistrationBox.value;
    if(!input)
    {
        outputMessage.textContent = "Error";
        return;
    }
    if(input)
    {
        let vehicles;
        let dbResult = GetVehicles(input);
        dbResult.then((data, error) =>
        {
            if(!error && data)
            {
                let prevSearchResults = document.getElementsByClassName('SearchResult');

                while(prevSearchResults[0]) {
                    prevSearchResults[0].parentNode.removeChild(prevSearchResults[0]);
                }

                vehicles = data
                console.log(vehicles);

                for(let i = 0; i < vehicles.length; i++)
                {
                    if(!vehicles[i].Make)
                        {
                            vehicles[i].Make = "Unknown";
                        }
                        if(!vehicles[i].Model)
                        {
                            vehicles[i].Model = "Unknown";
                        }
                        if(!vehicles[i].Colour)
                        {
                            vehicles[i].Colour = "Unknown";
                        }
                        if(vehicles[i].People)
                        {
                            if(!vehicles[i].People.Name)
                            {
                                vehicles[i].People.Name = "Unknown";
                            }
                            if(!vehicles[i].People.LicenseNumber)
                            {
                                vehicles[i].People.LicenseNumber = "Unknown";
                            }
                            ShowResponses(`License Plate: ${vehicles[i].VehicleID}\r\nMake: ${vehicles[i].Make}\r\nModel: ${vehicles[i].Model}\r\nColour: ${vehicles[i].Colour}\r\nOwner Name: ${vehicles[i].People.Name}\r\nOwner License Number: ${vehicles[i].People.LicenseNumber}\r\n\r\n`);
                        }
                        else
                        {
                            ShowResponses(`License Plate: ${vehicles[i].VehicleID}\r\nMake: ${vehicles[i].Make}\r\nModel: ${vehicles[i].Model}\r\nColour: ${vehicles[i].Colour}\r\nOwner Name: Unknown\r\nOwner License Number: Unknown\r\n\r\n`);
                        }
                }
                if(vehicles.length === 0)
                {
                    outputMessage.textContent = "No result found";
                }
                else
                {
                    outputMessage.textContent = "Search successful";
                }
                
            }
            else
            {
                ShowResponses("There was an error accessing the database.\r\n");
            }
        });
        
    }
}

async function GetVehicles(input)
{
    const { data, error } = await supabase.from("Vehicles").select("*, People:OwnerID (Name, LicenseNumber)").ilike("VehicleID",`%${input}%`);
    return data;
}

const VehicleRegistrationForm = document.getElementById("RegistrationForm");
if(VehicleRegistrationForm)
{
    VehicleRegistrationForm.addEventListener("submit", RegisterVehicle);
}

const VehicleLPBox = document.getElementById("rego");
const VehicleMakeBox = document.getElementById("make");
const VehicleModelBox = document.getElementById("model");
const VehicleColourBox = document.getElementById("colour");

const OwnerNameBox = document.getElementById("owner");
if(OwnerNameBox)
{
    OwnerNameBox.addEventListener("change", OwnerNameChanged);
}
const OwnerIDBox = document.getElementById("personID");
const OwnerName = document.getElementById("name");
const OwnerAddressBox = document.getElementById("address");
const OwnerDOBBox = document.getElementById("dob");
const OwnerLNBox = document.getElementById("license");
const OwnerEDBox = document.getElementById("expire");
const AddOwnerButton = document.getElementById("AddOwnerButton");
if(AddOwnerButton)
{
    AddOwnerButton.addEventListener("click", AddOwner);
}

function RegisterVehicle()
{
    let licensePlate = VehicleLPBox.value;
    let make = VehicleMakeBox.value;
    let model = VehicleModelBox.value;
    let colour = VehicleColourBox.value;
    let name = OwnerNameBox.value;
    

    if(licensePlate && make && model && colour && name)
    {
        ClearResponses();
        let owner = CheckOwnerExists(OwnerNameBox.value);
        owner.then((data, error) => 
        {
            if(!error && data)
            {
                if(data.length > 0)
                {
                    let successful = InsertVehicle(licensePlate, make, model, colour, name);
                    successful.then((error) => 
                    {
                        if(error)
                        {
                           outputMessage.textContent = "There was an error writing to the database. Please try again.";
                        }
                        else
                        {
                            outputMessage.textContent = "Vehicle added successfully";
                        }
                    });
                }
                else
                {
                    document.getElementById("OwnerInformationPara").hidden = false;
                    document.getElementById("address").type = "text";
                    document.getElementById("address").value = "";
                    document.getElementById("OwnerAddressLabel").hidden = false;
                    document.getElementById("address").hidden = false;
                    document.getElementById("dob").type = "text";
                    document.getElementById("dob").value = "";
                    document.getElementById("OwnerDOBLabel").hidden = false;
                    document.getElementById("dob").hidden = false;
                    document.getElementById("license").type = "text";
                    document.getElementById("license").value = "";
                    document.getElementById("OwnerLNLabel").hidden = false;
                    document.getElementById("license").hidden = false;
                    document.getElementById("expire").type = "text";
                    document.getElementById("expire").value = "";
                    document.getElementById("OwnerEDLabel").hidden = false;
                    document.getElementById("expire").hidden = false;
                    document.getElementById("personID").type = "text";
                    document.getElementById("personID").value = "";
                    document.getElementById("OwnerIDLabel").hidden = false;
                    document.getElementById("personID").hidden = false;
                    document.getElementById("AddOwnerButton").hidden = false;
                    document.getElementById("name").type = "text";
                    document.getElementById("name").value = "";
                    document.getElementById("OwnerNameLabel").hidden = false;
                    document.getElementById("name").hidden = false;
                    return;
                }
            }
            
        });
    }
    else
    {
        outputMessage.textContent = "Error";
        return;
    }
}

function OwnerNameChanged()
{
    let person = CheckOwnerExists(OwnerNameBox.value);
    person.then((data, error) =>
    {
        if(!error && data) 
        {
            if(data.length > 0)
            {
                document.getElementById("OwnerInformationPara").hidden = true;
                document.getElementById("address").type = "hidden";
                document.getElementById("address").value = data[0].Address;
                document.getElementById("OwnerAddressLabel").hidden = true;
                document.getElementById("address").hidden = true;
                document.getElementById("dob").type = "hidden";
                document.getElementById("dob").value = data[0].DOB;
                document.getElementById("OwnerDOBLabel").hidden = true;
                document.getElementById("dob").hidden = true;
                document.getElementById("license").type = "hidden";
                document.getElementById("license").value = data[0].LicenseNumber;
                document.getElementById("OwnerLNLabel").hidden = true;
                document.getElementById("license").hidden = true;
                document.getElementById("expire").type = "hidden";
                document.getElementById("expire").value = data[0].ExpiryDate;
                document.getElementById("OwnerEDLabel").hidden = true;
                document.getElementById("expire").hidden = true;
                document.getElementById("personID").type = "hidden";
                document.getElementById("personID").value = data[0].PersonID;
                document.getElementById("OwnerIDLabel").hidden = true;
                document.getElementById("AddOwnerButton").hidden = true;
                document.getElementById("name").type = "hidden";
                document.getElementById("name").value = data[0].Address;
                document.getElementById("OwnerNameLabel").hidden = true;
            }
            else
            {
                document.getElementById("OwnerInformationPara").hidden = false;
                document.getElementById("address").type = "text";
                document.getElementById("address").value = "";
                document.getElementById("OwnerAddressLabel").hidden = false;
                document.getElementById("address").hidden = false;
                document.getElementById("dob").type = "text";
                document.getElementById("dob").value = "";
                document.getElementById("OwnerDOBLabel").hidden = false;
                document.getElementById("dob").hidden = false;
                document.getElementById("license").type = "text";
                document.getElementById("license").value = "";
                document.getElementById("OwnerLNLabel").hidden = false;
                document.getElementById("license").hidden = false;
                document.getElementById("expire").type = "text";
                document.getElementById("expire").value = "";
                document.getElementById("OwnerEDLabel").hidden = false;
                document.getElementById("expire").hidden = false;
                document.getElementById("personID").type = "text";
                document.getElementById("personID").value = "";
                document.getElementById("OwnerIDLabel").hidden = false;
                document.getElementById("personID").hidden = false;
                document.getElementById("AddOwnerButton").hidden = false;
                document.getElementById("name").type = "text";
                document.getElementById("name").value = "";
                document.getElementById("OwnerNameLabel").hidden = false;
                document.getElementById("name").hidden = false;
            }
        }
    });
}

async function CheckOwnerExists(input)
{
    const { data, error } = await supabase.from("People").select("*").eq('Name',`${input}`);
    return data;
}

async function InsertPerson(id, name, address, dob, licenseNumber, expiryDate)
{
    const { error } = await supabase.from("People").insert([{PersonID: id, Name: name, Address: address, DOB: dob, LicenseNumber: licenseNumber, ExpiryDate: expiryDate}]);
    return error;
}

async function InsertVehicle(licensePlate, make, model, colour, name)
{
    let ownerID = GetIDFromName(name);
    let owner;
    ownerID.then(async (data, error) => 
        {
            if(!error && data)
            {
                owner = data[0].PersonID;
                const { error } = await supabase.from("Vehicles").insert([{VehicleID: licensePlate, Make: make, Model: model, Colour: colour, OwnerID: owner}]);
                return error;
            }
        });
}

async function GetIDFromName(name)
{
    const {data, error} = await supabase.from("People").select("PersonID").eq('Name',`${name}`);
    return data;
}

async function AddOwner()
{
    let id = OwnerIDBox.value;
    let ownerName = OwnerName.value;
    let address = OwnerAddressBox.value;
    let dob = OwnerDOBBox.value;
    let licenseNumber = OwnerLNBox.value;
    let expiryDate = OwnerEDBox.value;

    let licensePlate = VehicleLPBox.value;
    let make = VehicleMakeBox.value;
    let model = VehicleModelBox.value;
    let colour = VehicleColourBox.value;

    if(id && ownerName && address && dob && licenseNumber && expiryDate && licensePlate && make && model && colour)
    {
        let successful = InsertPerson(id, ownerName, address, dob, licenseNumber, expiryDate);
        successful.then((error) => 
        {
            if(error)
            {
                outputMessage.textContent = "There was an error writing to the database. Please try again.";
                return;
            }
            let successful = InsertVehicle(licensePlate, make, model, colour, ownerName);
            successful.then((error) => 
            {
                if(error)
                {
                    outputMessage.textContent = "There was an error writing to the database. Please try again.";
                }
                else
                {
                    outputMessage.textContent = "Vehicle added successfully";
                }
            });
        });
    }
    else
    {
        outputMessage.textContent = "Error";
        return;
    }
}

////////// TESTS FOR REQUIREMENT 3 //////////

/*import { test, expect } from '@playwright/test';

test('Works for existing owner', async ({page}) =>
{
    await page.goto("https://bbates04.github.io/COMP1004Project/vehicleRegister.html");
});*/
