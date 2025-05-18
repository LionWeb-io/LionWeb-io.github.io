using System.Text.Json;
using System.Text.Json.Serialization;
using LionWeb.Core;
using LionWeb.Core.M1;
using LionWeb.Core.M3;
using LionWeb.Core.VersionSpecific.V2024_1;

public class AuthoringDynamicLanguage
{
    public static void Run()
    {

        var language = new DynamicLanguage("lang", LionWebVersions.v2024_1)
        {
            Key = "key-lang",
            Version = "0",
            Name = "Complaints Language",
        };
        var complaintsBook = new DynamicConcept("complaints-book", LionWebVersions.v2024_1, language)
        {
            Partition = true,
            Key = "complaints-book",
            Name = "Complaints Book",
        };
        var complaint = new DynamicConcept("complaint", LionWebVersions.v2024_1, language)
        {
            Key = "complaint",
            Name = "Complaint",
        };
        var date = new DynamicPrimitiveType("date", LionWebVersions.v2024_1, language)
        {
            Key = "date",
            Name = "Date"
        };
        language.AddEntities([complaintsBook, complaint, date]);

        var bookComplaints =
            new DynamicContainment("complaints-book-complaints", LionWebVersions.v2024_1, complaintsBook)
            {
                Key = "complaints-book-complaints",
                Name = "Complaints",
                Optional = false,
                Multiple = true,
                Type = complaint
            };
        complaintsBook.AddFeatures([bookComplaints]);

        var complaintDate = new DynamicProperty("complaint-date", LionWebVersions.v2024_1, complaint)
        {
            Key = "complaint-date",
            Name = "Date",
            Optional = true,
            Type = date
        };
        var complaintDescription = new DynamicProperty("complaint-description", LionWebVersions.v2024_1, complaint)
        {
            Key = "complaint-description",
            Name = "Description",
            Optional = false,
            Type = BuiltInsLanguage_2024_1.Instance.String,
        };
        var complaintUrgent = new DynamicProperty("complaint-urgent", LionWebVersions.v2024_1, complaint)
        {
            Type = BuiltInsLanguage_2024_1.Instance.Boolean,
            Key = "complaint-urgent",
            Name = "Urgent?",
            Optional = false,
        };
        complaint.AddFeatures([complaintDate, complaintDescription, complaintUrgent]);

        var serializationChunk = new SerializerBuilder().WithLionWebVersion(LionWebVersions.v2024_1).Build()
            .SerializeToChunk([language]);

        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        var filePath = "ComplaintsLanguage.json";
        File.WriteAllText(filePath, JsonSerializer.Serialize(serializationChunk, options));

        Console.WriteLine($"Serialized JSON saved to: {Path.GetFullPath(filePath)}");
    }
}