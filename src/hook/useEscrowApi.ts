import { useMessageModalStore } from '@/shared/store/useMessageModalStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Escrow } from '../../types';
import apiService from '@/lib/service/apiService';
import { useEscrowStore } from '@/shared/store/useEscrowStore';

export default function useEscrowApi() {
  const {
    selectedDispute,
    setSelectedDispute,
    selectedEscrow,
    setSelectedEscrow,
    escrows,
    setEscrows,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    disputeFilter,
    setDisputeFilter,
    disputeEvidence,
    setDisputeEvidence,
    showDetailsModal,
    setShowDetailsModal,
    getStatusIcon,
    getStatusColor,
    getDaysUntilRelease,
    filteredEscrows,
    statusCounts,
    totalValue,
  } = useEscrowStore();
  const queryClient = useQueryClient();
  const { onOpen } = useMessageModalStore();

  // Fetch escrows
  const { isLoading: queryLoading } = useQuery<Escrow[], Error>({
    queryKey: ['escrows'],
    queryFn: async ({ signal }) => {
      const { response } = await apiService<Escrow[]>({
        endpoint: '/escrows',
        method: 'GET',
        signal,
        requiresAuth: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setEscrows(data);
    },
  });

  // Update escrow status
  const updateStatusMutation = useMutation<void, Error, { id: string; status: Escrow['status'] }>({
    mutationFn: async ({ id, status }) => {
      await apiService({
        endpoint: `/escrows/${id}`,
        method: 'PATCH',
        body: { status },
        requiresAuth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
      onOpen({
        title: 'Success',
        message: 'Escrow status updated successfully',
        type: 'success',
        autoClose: true,
        autoCloseDelay: 3000,
        closable: true,
        showIcon: true,
        actions: null,
      });
    },
  });

  // Submit dispute evidence
  const submitDisputeMutation = useMutation<void, Error, { escrowId: string; evidence: string }>({
    mutationFn: async ({ escrowId, evidence }) => {
      await apiService({
        endpoint: `/disputes/${escrowId}/respond`,
        method: 'POST',
        body: { evidence },
        requiresAuth: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
      onOpen({
        title: 'Success',
        message: 'Dispute evidence submitted successfully',
        type: 'success',
        autoClose: true,
        autoCloseDelay: 3000,
        closable: true,
        showIcon: true,
        actions: null,
      });
      setDisputeEvidence('');
      setSelectedDispute(null);
    },
  });

  const handleStatusUpdate = (escrowId: string, newStatus: Escrow['status']) => {
    updateStatusMutation.mutate({ id: escrowId, status: newStatus });
  };

  const handleDisputeSubmit = () => {
    if (!disputeEvidence.trim()) {
      onOpen({
        title: 'Error',
        message: 'Please provide dispute evidence',
        type: 'error',
        autoClose: true,
        autoCloseDelay: 5000,
        closable: true,
        showIcon: true,
        actions: null,
      });
      return;
    }
    if (selectedDispute) {
      submitDisputeMutation.mutate({ escrowId: selectedDispute._id, evidence: disputeEvidence });
    }
  };

  const handleExport = () => {
    // Placeholder: Implement export logic (e.g., CSV download)
    onOpen({
      title: 'Info',
      message: 'Export feature coming soon!',
      type: 'info',
      autoClose: true,
      autoCloseDelay: 3000,
      closable: true,
      showIcon: true,
      actions: null,
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['escrows'] });
  };
}
