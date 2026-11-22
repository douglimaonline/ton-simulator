export class Modal {
  title: string;
  message: string;
  showConfirmButton: boolean;

  constructor(title: string, message: string, showConfirmButton: boolean) {
    this.title = title;
    this.message = message;
    this.showConfirmButton = showConfirmButton;
  }

  static data(isValidateChanges: boolean): Modal {
    if (isValidateChanges) {
      return Modal.validChanges();
    } else {
      return Modal.invalidChanges();
    }
  }

  static validChanges(): Modal {
    return new Modal(
      'Confirmar Alteração',
      'Esta alteração irá modificar as taxas do plano selecionado para todos os usuários. Altere somente se a taxa estiver desatualizada. Deseja confirmar?',
      true
    );
  }

  static invalidChanges(): Modal {
    return new Modal(
      'Nenhuma Alteração Detectada',
      'As taxas do plano selecionado permanecem inalteradas. Altere pelo menos uma taxa para prosseguir.',
      false
    );
  }

  static confirmCreate(label: string): Modal {
    return new Modal(
      'Criar Plano',
      `O plano "${label}" ficará disponível para todos os usuários. Deseja confirmar?`,
      true
    );
  }

  static confirmDelete(label: string): Modal {
    return new Modal(
      'Excluir Plano',
      `O plano "${label}" será excluído para todos os usuários. Esta ação não pode ser desfeita. Deseja confirmar?`,
      true
    );
  }

  /** The new plan cannot be saved; `reason` says what to fix. */
  static invalidPlan(reason: string): Modal {
    return new Modal('Plano Inválido', reason, false);
  }
}
