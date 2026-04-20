package io.github.ds.planeja.dominio.categoria;

import io.github.ds.planeja.common.exceptions.RegistroNaoEncontradoException;
import io.github.ds.planeja.common.exceptions.ValidationException;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaForm;
import io.github.ds.planeja.dominio.categoria.mapper.CategoriaMapper;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaValidator validator;
    @Autowired
    private CategoriaRepository repository;
    @Autowired
    private CategoriaMapper mapper;

    public CategoriaDetalhes criar(CategoriaForm form) {
        var result = validator.validar(form, null);

        if (result.isInvalido()) {
            throw new ValidationException(result.getCampoInvalidos());
        }

        CategoriaEntity entity = mapper.toEntity(form);
        repository.save(entity);
        return mapper.toDetalhes(entity);
    }

    public Page<CategoriaDetalhes> listar(PageRequest pageRequest) {
        return repository
                .findAll(pageRequest)
                .map(mapper::toDetalhes);
    }

    @Transactional
    public void mudarStatus(UUID id) {
        var categoria = repository.findById(id)
                .orElseThrow(RegistroNaoEncontradoException::new);

        categoria.setAtivo(!categoria.getAtivo());
        repository.save(categoria);
    }
}
