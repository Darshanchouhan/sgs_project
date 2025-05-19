import React, { useEffect } from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import ComponentSubHeaderStrip from "./ComponentSubHeaderStrip";
import ComponentSidePanel from "./ComponentSidePanel";
import ComponentForm from "./ComponentForm";
import AdminApproveSKUModal from "../AdminApproveSKUModal";
import AdminRequestChangesModal from "../AdminRequestChangesModal";
import axiosInstance from "../../../services/axiosInstance";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters

const AdminComponentPage = () => {
  const [skuComponentDataIncoming, setSkuComponentDataIncoming] =
    React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [groupingSectionData, setGroupingSectionData] = React.useState();
  const [activeSection, setActiveSection] = React.useState("");
  const [questionAvailable, setQuestionAvailable] = React.useState([]);
  const [componentsId, setComponentsId] = React.useState([]);
  const [apiCallAgain, setApiCallAgain] = React.useState(1);

  const { pkoId, skuId, componentId } = useParams(); // Assuming you are using react-router-dom for routing

  const getSKUComponentDataDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `sku/${skuId}/components/?pko_id=${pkoId}`,
      );
      const skuComponentData = response.data;
      const selectComponentData = skuComponentData?.filter(
        (item) => item?.id == Number(componentId),
      )[0];
      setSkuComponentDataIncoming(selectComponentData);
      setQuestionAvailable(
        Object?.keys(selectComponentData?.responses)?.map((item) => {
          return item?.split("||")[0];
        }),
      );
      setComponentsId(skuComponentData?.map((item) => item.id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PKO details:", error);
      setLoading(false);
    }
  };

  const processQuestions = (data) => {
    const questions = data.components[0].component_questions;
    const questionMap = new Map();

    //populate the questionMap with initial questions
    questions.forEach((q) => {
      if (!q.question_id) {
        console.warn(`Question without an ID found:`, q);
      } else {
        questionMap.set(q.question_id, { ...q, children: [] });
      }
    });
    // Add child questions to their respective parents
    questions.forEach((q) => {
      if (q.dependent_question) {
        const dependentQuestions = Array.isArray(q.dependent_question)
          ? q.dependent_question
          : [q.dependent_question];

        dependentQuestions.forEach((parentId) => {
          if (questionMap.has(parentId)) {
            questionMap.get(parentId).children.push(q);
          } else {
            // console.log(
            //   `Parent question with ID not found for question ${q.question_id}.`,
            // );
          }
        });
      }
    });

    // Group questions into sections
    const groupedSections = {};
    Array.from(questionMap.values()).forEach((question) => {
      const section = question.section || "Uncategorized";
      if (!groupedSections[section]) {
        groupedSections[section] = [];
      }
      groupedSections[section].push(question);
    });

    setGroupingSectionData((prev) => ({
      ...prev,
      sections: groupedSections,
    }));
    setActiveSection(Object.keys(groupedSections)?.[0]);
  };

  const fetchQuestionaireData = async () => {
    try {
      const response = await axiosInstance.get("questionnaire/");
      const data = response.data;

      processQuestions(data); // Process the fetched data
    } catch (error) {
      console.error("Error fetching questionnaire data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSKUComponentDataDetails();
    fetchQuestionaireData();
  }, [pkoId, skuId, componentId, apiCallAgain]);

  return (
    <div>
      {/* Navbar */}
      <HeaderAdmin />
      {loading && (
        <div className="loader">
          <div className="loaderOverlay d-flex align-items-center justify-content-center bg-secondary rounded-4">
            <img
              src="/assets/images/loading_gif.gif"
              alt="Loading..."
              width="120px"
              height="120px"
            />
          </div>
        </div>
      )}
      <div className="d-flex">
        <DashboardSidebar />
        <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
          <ComponentSubHeaderStrip
            skuComponentDataIncoming={skuComponentDataIncoming}
            componentsAllId={componentsId}
            setLoading={setLoading}
            setApiCallAgain={setApiCallAgain}
          />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
            <div className="row">
              <ComponentSidePanel
                groupingSectionName={
                  groupingSectionData &&
                  Object.keys(groupingSectionData?.sections || {})
                }
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
              <ComponentForm
                questionAvailable={questionAvailable}
                skuComponentDataIncoming={skuComponentDataIncoming}
                groupingSectionData={groupingSectionData?.sections}
                activeSection={activeSection}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Approve SKU Modal Popup */}
      <AdminApproveSKUModal />

      {/* Request Changes Modal Popup */}
      <AdminRequestChangesModal />
    </div>
  );
};

export default AdminComponentPage;
