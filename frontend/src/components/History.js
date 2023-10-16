import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HistoryCard from "./HistoryCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ExportToExcel from "./ExportToExcel";

function History() {
  const [history, setHistory] = useState([]);
  let toastId = null;

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      toast.warning("Please Login First");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      toastId = null;
      toastId = toast.loading("Fetching History...");
      const result = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/history`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setHistory(result.data.urlArray);
      // console.log(history);
      if (result.data.urlArray.length === 0) {
        toast.update(toastId, {
          render: "No History Found",
          type: "info",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.update(toastId, {
          render: "Please Login First",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }

      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <Container className={"pb-5"}>
      <Row className={"my-1"}>
        {history.map((data) => {
          return (
            <Col md={6} className={"p-1"}>
              <HistoryCard
                shortUrl={data.shortUrl}
                originalUrl={data.originalUrl}
                visitCount={data.visitCount || 0}
              />
            </Col>
          );
        })}
      </Row>
      <Row>
        <ExportToExcel />
      </Row>
    </Container>
  );
}

export default History;
